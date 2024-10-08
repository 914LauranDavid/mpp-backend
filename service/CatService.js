const { startCatRepository, errorCat } = require('../repository/CatRepository');
const { OpenAI } = require("openai");

const openai = new OpenAI();

const pageSize = 5;

const startCatService = () => {
    const { getAll, getCount, getById, add, deleteById, update, toysPerCat, getUsersFavoriteBreedById, getAllSortedPaginated,
        getAgeDistribution, getUsersCatsById, buy, setTheAvatar, getCutestCatOfUser
    } =
        startCatRepository(true);

    const getAllCatsSortedAndPaginated = async (sortByNameDirection, pageNumber) => {
        console.log("will get cats: " + sortByNameDirection + pageNumber);
        if (pageNumber === "0" || pageNumber === 0) {
            return getAll();
        }

        let allCats = await getAllSortedPaginated(
            sortByNameDirection === "asc" ? 1 : -1,
            pageSize * (pageNumber - 1) + 1,
            pageSize * pageNumber
        );

        console.log('service: returning ' + allCats);

        return allCats;
    };

    const getCatCount = () => {
        return getCount();
    }

    const getCatById = async (id) => {
        if (Number.isNaN(parseInt(id)))
            return errorCat;

        return await getById(parseInt(id));
    }

    const addCat = ({ name, age, weight, cuteness, ownerId }) => {
        if (Number.isNaN(parseInt(age)) || Number.isNaN(parseInt(weight)))
            return false;

        add({ name, age, weight, cuteness, ownerId });
        return true;
    }

    const updateCat = async (id, newCat) => {
        console.log('service updatecat: ' + JSON.stringify(newCat));
        if (Number.isNaN(parseInt(newCat.weight)) || Number.isNaN(parseInt(newCat.age)))
            return false;
        // if (parseInt(newCat.weight) < 0 || parseInt(newCat.age < 0))
        //     return false;

        await update(id, newCat);
        return true;
    }

    const deleteCat = async (id) => {
        return await deleteById(id);
    }

    const getUsersFavoriteBreed = async (userId) => {
        return await getUsersFavoriteBreedById(userId);
    }

    const getToysPerCat = (count) => {
        return toysPerCat(count);
    }

    const getCatAgeDistribution = async () => {
        return await getAgeDistribution();
    }

    const getMyCats = async (userId) => {
        return await getUsersCatsById(userId);
    }

    const buyCatById = async (catId, userId) => {
        return await buy(catId, userId);
    }

    const setAvatar = async (catId, prompt) => {
        console.log(`catservice setavatar`);

        const chatGptPrompt = `I have a site called CatApp, where users buy cats and play with them. Users can set their cats' avatars, by inputting a prompt, which I send to you. What you have to do is to decide, based on their prompt, how the cat's avatar's body, fur, eyes, mouth, and accessory should look like.
            Hence, first I will give you the different types of body, fur, eyes, mouth, and accessory. Then, I will give you the user's prompt.
            You will have to give me one number for each part (body, fur, eyes, mouth, and accessory). Write it as a JSON, for example: {body: 3, fur: 2, eyes: 8, mouth: 4, accessory: 5}. Only send the JSON, do not send anything else.

            Body types:
            1: bright orange
            2: creamy white
            3: dark orange
            4: dark grey
            5: muddy orange
            6: yellow
            7: light blue
            8: brown
            9: pink and girly
            11: red
            12: light purple
            13: dark gray, almost black
            14: green
            15: brick color

            Fur:
            1: some lines on the fur
            2: some lines on the fur
            3: no marks on the fur
            4: fur has circle-like marks
            5: cat has a black patch on its eye
            6: cat has a white patch on its eye
            7: almost no marks on the fur
            8: cat has a white patch on its nose
            9: cat has square patches on its fur
            10: cat has a lot of little circle patches

            Eyes:
            1: big, round
            2: big, more wide than tall
            3: very small
            4: big, more tall than wide
            5: with a monocle
            6: square
            7: closed and happy
            8: round, medium-to-big-sized
            9: round, medium-sized
            10: green
            11: girly, with a lot of make-up
            12: round and relatively small
            13: with square eyeglasses
            14: very tall
            15: girly, a little bit of make-up

            Mouth:
            1: open, happy
            2: closed, satisfied
            3: open, surprised
            4: wide open, excited
            5: 80% open, happy
            6: 60% open, happy
            7: closed, satisfied
            9: smiling, you can see its teeth

            Accessory:
            1: red scarf
            2: collar with key
            3: laptop/phone
            4: collar without key
            5: head band
            6: cute bow tie on its head
            7: black elegant hat
            8: black headphones and ipad
            9: blue scarf
            11: typewriter
            12: collar with diamonds
            13: black head band
            15: red elegant hat
            16: silver headphones
            17: none

            The user's prompt: "${prompt}"`;

        // return res.status(200).json([]);
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: chatGptPrompt }],
            model: "gpt-3.5-turbo",
        });

        const avatarParameters = completion.choices[0].message.content;

        console.log('response for generating avatar: ' + avatarParameters);

        console.log(`service setavatar params: ${JSON.stringify(avatarParameters)}`);

        return await setTheAvatar(catId, avatarParameters);
    }

    const getMyCutest = async (userId) => {
        return await getCutestCatOfUser(userId);
    }

    return {
        getAllCatsSortedAndPaginated, getCatCount, getCatById, addCat, updateCat, deleteCat, getToysPerCat, getUsersFavoriteBreed,
        getCatAgeDistribution, getMyCats, buyCatById, setAvatar, getMyCutest
    };
}

module.exports = { startCatService };