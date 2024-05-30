var express = require('express');
var router = express.Router();
var dbConn = require('../services/db');

router.get('/', async (req, res, next) => {
    try {
        const rows = await dbConn.query(`SELECT *  from game_inventory;`)
        res.render('games', { data: rows });
    } catch (err){
        req.flash('error', err);
        res.render('games', { data: '' });   
    }
});

// display add game page
router.get('/add', async (req, res, next) => {
    // render to add.ejs
    res.render('games/add', {
        name: '',
        geo: '',
        platform: '',
        purchase_date: '',
        price: ''
    })
})

// add a new game
router.post('/add', async (req, res, next) => {

    let name = req.body.name;
    let geo = req.body.geo;
    let platform = req.body.platform;
    let purchase_date = req.body.purchase_date;
    let price = req.body.price;

    var form_data = {
        name: name,
        geo: geo,
        platform: platform,
        purchase_date: purchase_date,
        price: price
    }

    try {

        const rows = await dbConn.query('INSERT INTO game_inventory SET ?', form_data)
        req.flash('success', 'Game successfully added');
        res.redirect('/games');
    } catch (err) {
        req.flash('error', err);
        res.render('games/add', {
            id: req.params.id,
            name: form_data.name,
            geo: form_data.geo,
            platform: form_data.platform,
            purchase_date: form_data.purchase_date,
            price: form_data.price
        })
    }

})

// display edit game page
router.get('/edit/(:id)', async (req, res, next) => {

    let id = req.params.id;
    try {
        const rows = await dbConn.query('SELECT * FROM game_inventory WHERE id = ' + id)

        // if game not found
        if (rows.length <= 0) {
            req.flash('error', 'Game not found with id = ' + id)
            res.redirect('/games')
        }
        // if game found
        else {
            // render to edit.ejs
            res.render('games/edit', {
                title: 'Edit Game',
                id: rows[0].id,
                name: rows[0].name,
                geo: rows[0].geo,
                platform: rows[0].platform,
                purchase_date: rows[0].purchase_date,
                price: rows[0].price,

            })
        }
    } catch (err) {
        req.flash('error', err);
        res.render('games', { data: '' });
    }


})

// update game data
router.post('/update/:id', async (req, res, next) => {

    let id = req.params.id;
    let name = req.body.name;
    let geo = req.body.geo;
    let platform = req.body.platform;
    let purchase_date = req.body.purchase_date;
    let price = req.body.price;

    var form_data = {
        name: name,
        geo: geo,
        platform: platform,
        purchase_date: purchase_date,
        price: price
    }
    // update query

    try {
        const rows = await dbConn.query('UPDATE game_inventory SET ? WHERE id = ' + id, form_data)
        req.flash('success', 'Game successfully updated');
        res.redirect('/games');            
    } catch (err) {
        req.flash('error', err);
        res.render('games/edit', {
            id: req.params.id,
            name: form_data.name,
            geo: form_data.geo,
            platform: form_data.platform,
            purchase_date: form_data.purchase_date,
            price: form_data.price
        })
    }
    
})

// delete game
router.get('/delete/(:id)', async (req, res, next) => {

    let id = req.params.id;

    try {
        const rows = await dbConn.query('DELETE FROM game_inventory WHERE id = ' + id)
        req.flash('success', 'Game successfully deleted! ID = ' + id);
        res.redirect('/games');
    } catch (err) {
        req.flash('error', err);
        res.redirect('/games');
    }

})

module.exports = router;