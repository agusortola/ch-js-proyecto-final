class ProductInCart {
    constructor(
        name,
        qty,
        price,
    ){
        this.name = name;
        this.qty = Number (qty);
        this.price = Number (price);
    }
    addQty(qty){
        this.qty+= Number (qty);
    }

    toMPProduct() {
        const title = this.name;
        const description = this.name;
        const qty = this.qty;
        const price = this.price;
        let mpProduct = new ProductForMP (title, description, qty, price);
        return mpProduct;
    }
};
