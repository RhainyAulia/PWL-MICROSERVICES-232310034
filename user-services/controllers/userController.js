const User = require("../models/User");
const Counter = require("../models/Counter");

// GET ALL
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET USER BY ID (pakai id angka)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ id: Number(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// fungsi ambil ID berikutnya
const getNextSequence = async (name) => {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// CREATE USER
exports.createUser = async (req, res) => {
    try {
        const newId = await getNextSequence("userId");

        const user = new User({
            id: newId,
            ...req.body
        });

        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// UPDATE
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { id: Number(req.params.id) },
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// DELETE
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            id: Number(req.params.id)
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};