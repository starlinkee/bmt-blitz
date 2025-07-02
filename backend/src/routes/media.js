const express = require('express');
const { 
  Client, 
  MediaType, 
  MediaTemplate, 
  ClientMediaTemplate,
  MediaRecord, 
  MediaBatch,
  sequelize 
} = require('../../models/index.js');

const router = express.Router();

// POST /media/prepare - Generuje pozycje za media dla danego miesiąca
router.post('/prepare', async (req, res) => {
  const { month } = req.body; // format: "2025-07"
  
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ 
      error: 'Nieprawidłowy format miesiąca. Użyj formatu YYYY-MM' 
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Sprawdź czy już istnieje batch dla tego miesiąca
    const existingBatch = await MediaBatch.findOne({ 
      where: { month },
      transaction 
    });

    if (existingBatch) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: `Pozycje za media dla miesiąca ${month} już zostały wygenerowane` 
      });
    }

    // Pobierz wszystkie aktywne przypisania szablonów do klientów
    const clientTemplates = await Client.findAll({
      include: [{
        model: ClientMediaTemplate,
        as: 'ClientMediaTemplates',
        include: [{
          model: MediaTemplate,
          as: 'MediaTemplate',
          include: [{
            model: MediaType,
            as: 'MediaType'
          }]
        }],
        where: { active: true }
      }],
      transaction
    });

    if (clientTemplates.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: 'Nie znaleziono aktywnych szablonów mediów dla żadnego klienta' 
      });
    }

    const createdRecords = [];

    // Dla każdego klienta i jego szablonów
    for (const client of clientTemplates) {
      for (const clientTemplate of client.ClientMediaTemplates) {
        const template = clientTemplate.MediaTemplate;
        const mediaType = template.MediaType;
        
        // Sprawdź czy już istnieje rekord dla tego klienta, typu i miesiąca
        const existingRecord = await MediaRecord.findOne({
          where: {
            client_id: client.id,
            media_type_id: mediaType.id,
            year: parseInt(month.split('-')[0]),
            month: parseInt(month.split('-')[1])
          },
          transaction
        });

        if (!existingRecord) {
          // Utwórz nowy rekord
          const mediaRecord = await MediaRecord.create({
            client_id: client.id,
            media_type_id: mediaType.id,
            year: parseInt(month.split('-')[0]),
            month: parseInt(month.split('-')[1]),
            status: 'pending',
            media_template_id: template.id,
            created_at: new Date(),
            updated_at: new Date()
          }, { transaction });

          createdRecords.push({
            id: mediaRecord.id,
            client: client.name,
            mediaType: mediaType.name,
            year: mediaRecord.year,
            month: mediaRecord.month
          });
        }
      }
    }

    // Utwórz batch record
    await MediaBatch.create({
      month,
      created_at: new Date()
    }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: `Wygenerowano ${createdRecords.length} pozycji za media dla miesiąca ${month}`,
      records: createdRecords
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Błąd podczas generowania pozycji za media:', error);
    res.status(500).json({ 
      error: 'Wystąpił błąd podczas generowania pozycji za media' 
    });
  }
});

// GET /media/records - Pobiera listę rekordów mediów
router.get('/records', async (req, res) => {
  try {
    const { month, status } = req.query;
    
    const whereClause = {};
    if (month) {
      whereClause.year = parseInt(month.split('-')[0]);
      whereClause.month = parseInt(month.split('-')[1]);
    }
    if (status) {
      whereClause.status = status;
    }

    const records = await MediaRecord.findAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as: 'Client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: MediaType,
          as: 'MediaType',
          attributes: ['id', 'name']
        },
        {
          model: MediaTemplate,
          as: 'MediaTemplate',
          attributes: ['id', 'formula', 'variables_json']
        }
      ],
      order: [['id', 'DESC']]
    });

    res.json(records);

  } catch (error) {
    console.error('Błąd podczas pobierania rekordów mediów:', error);
    res.status(500).json({ 
      error: 'Wystąpił błąd podczas pobierania rekordów mediów' 
    });
  }
});

module.exports = router; 