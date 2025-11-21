class ChatBotMiddleware {
    static generateRuleTips(req, res, next) {
        const { memory, messages } = req.body;
        req.ruleTips = "";

        if (!messages || typeof messages !== 'string') {
            return next();
        }

        if (messages.includes("vegetable")) {
            req.ruleTips += "Store vegetables in breathable produce bags to reduce spoilage.";
        } else if (messages.includes("budget")) {
            req.ruleTips += "Plan meals around seasonal produce to save money.";
        } else if (messages.includes("leftovers")) {
            req.ruleTips += "Incorporate leftovers into new recipes to minimize waste.";
        } else if (messages.includes("nutrition")) {
            req.ruleTips += "Balance meals with a variety of food groups for optimal nutrition.";
        }

        next();
    }
}

export default ChatBotMiddleware;