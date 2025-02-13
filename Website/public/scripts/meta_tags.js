module.exports = {
	metaTags: function (data) {
		let description;
		return "Create Login test";

		switch (data) {
			case index:
				description: "Homepage for HelpUsRecycle: Give your plastic bottles to a collector who will recycle them for you in exchange for the deposit money.";
				break;
			case account:
				description: "Create or login to your account";
				break;
			case collect:
				description: "Find bottles in your area, collect and recycle them. The deposit money refund is yours.";
				break;
			case about:
				description: "About HelpUsRecycle - Find out why we created this service to give and collect bottles near you.";
				break;
			case profile:
				description: "user profile";
				break;
			case give:
				description: "Find bottles in your area, collect and recycle them. The deposit money refund is yours.";
				break;
			case contact:
				description: "Contact HelpUsRecycle";
				break;
			case legal_notice:
				description: "legal notice HelpUsRecycle";
				break;
			case terms_conditions:
				description: "terms and conditions HelpUsRecycle";
				break;
			case order_details:
				description: "order details";
				break;
			// case accept_order:
			// 	description: "order details";
			// 	break;
			default:
				description: "Help us recycle";
				break;
		}
	},
};
