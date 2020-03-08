import Reserve from "../models/Reserve";
import User from "../models/User";
import House from "../models/House";

class ReserveController {
    async destroy(req, res) {
        const { reserve_id } = req.body;

        await Reserve.findByIdAndDelete({ _id: reserve_id });

        return res.send();
    }

    async index(req, res) {
        const { user_id } = req.headers;

        const reserves = await Reserve.find({ user: user_id }).populate(
            "house"
        );

        return res.json(reserves);
    }

    async store(req, res) {
        const { date } = req.body;
        const { user_id } = req.headers;
        const { house_id } = req.params;

        const house = await House.findById(house_id);

        if (!house) {
            return res.status(400).json({ message: "Essa casa não existe" });
        }

        if (!house.status) {
            return res
                .status(400)
                .json({ message: "Solicitação indisponivel" });
        }

        const user = await User.findById(user_id);

        if (String(user._id) === String(house.user)) {
            return res.status(401).json({ message: "Você ja fez uma reserva" });
        }

        const reserve = await Reserve.create({
            user: user_id,
            house: house_id,
            date,
        });

        await reserve
            .populate("house")
            .populate("user")
            .execPopulate();

        return res.json(reserve);
    }
}

export default new ReserveController();
