var express = require('express');
const { startToyService } = require('../service/ToyService');
var router = express.Router();


const { getAllToys, getToyCount, getToyById, addToy, updateToy, deleteToy } = startToyService();

const validateToy = (toy) => {
    if (!toy.hasOwnProperty("name") || !toy.hasOwnProperty("catId"))
        return false;
    if (Object.keys(toy).length !== 2)
        return false;
    if (toy.name.length == 0)
        return false;
    return true;
}

router.get('/', (req, res, next) => {
    res.send('toys route...');
});

router.get('/count', async (req, res, next) => {
    console.log('enter count');
    let count = await getToyCount();
    console.log('got count');
    res.json({ count: count });
})

router.get('/all', async (req, res, next) => {
    res.json(await getAllToys());
});

router.route("/get-by-id/:id").get(async (req, res) => {
    let givenId = req.params.id;

    const toy = await getToyById(givenId);

    if (toy.id === -1) {
        return res.status(404).json({ error: `No toy with id ${givenId}` });
    }

    res.json(toy);
});

router.post("/add", async (req, res, next) => {
    let givenToy = req.body;

    if (!validateToy(givenToy))
        return res.status(400).json({ error: `Toy has an invalid form` });

    if (addToy(givenToy))
        return res.json({ message: "Successfully added the toy" });
    else
        return res.status(400).json({ error: `Toy is not valid` });
});

router.route("/update/:id").put(async (req, res) => {
    let givenId = parseInt(req.params.id);
    const givenToy = req.body;

    if (!validateToy(givenToy))
        return res.status(400).json({ error: `Toy has an invalid form` });

    if (getToyById(givenId).id === -1) {
        return res.status(404).json({ error: `No toy with id ${givenId}` });
    }

    let successful = await updateToy(givenId, { id: givenId, name: givenToy.name, catId: givenToy.catId });

    if (successful)
        return res.json({ message: "Successfully updated the toy" });
    else
        return res.status(400).json({ error: `Toy is not valid` });
});

router.route("/delete/:id").delete(async (req, res) => {
    let givenId = parseInt(req.params.id);

    if (getToyById(givenId).id === -1) {
        return res.status(404).json({ error: `No toy with id ${givenId}` });
    }

    deleteToy(givenId);

    return res.json({ message: "Successfully deleted the toy" });
});

module.exports = router;
