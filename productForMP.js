class ProductForMP {
    constructor(
        title,
        description,
        quantity,
        unit_price,
    ){
        this.title = title;
        this.description = description;
        this.quantity = Number (quantity);
        this.currency_id = 'ARS';
        this.unit_price = unit_price;
    }
    addQty(quantity){
        this.quantity+= Number (quantity);
    }
};
