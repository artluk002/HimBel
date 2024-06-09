import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3300',
})

export const CatalogAPI = {
    typesReq(){
        return instance.get('/getTypes')
    },
    subtypesReq(){
        return instance.get('/getSubTypes')
    },
    typesForMainReq(){
        return instance.get('/getTypesAndSubTypesForMain')
    },
    productsForCatalogReq(type_id){
        return instance.get(`/getProductsBy/${type_id}`)
    },
    deltedProductsReq() {
        return instance.get(`/getDeletedProducts`);
    },
    productDetailsReq(id) {
        return instance.get(`/getProductBy/${id}`);
    },
    productCharacteristicsReq(product_id) {
        return instance.get(`/getCharacteristicsBy/${product_id}`)
    },
    productCharacteristicsForListReq(product_id) {
        return instance.get(`/getCharacteristicsForListBy/${product_id}`)
    },
    CharacteristicsReq() {
        return instance.get(`/getCharacteristics`)
    },
    allTypesReq() {
        return instance.get("/getAllTypes")
    },
    appTypeReq({name, subtype_id}) {
        return instance.post('/sendNewType', {name, subtype_id})
    },
    addNewProductReq({name, price, description, product_characteristics, type_id}) {
        return instance.post('/addNewProduct', {name, price, description, product_characteristics, type_id})
    },
    addNewProductCharacteristicsReq({product_id, product_characteristics}) { 
        return instance.post('/addNewProductCharacteristc', {product_id, product_characteristics})
    },
    updateTypeByIdReq({id,name, subtype_id}) {
        return instance.put(`/updateType/${id}`,{name, subtype_id})
    },
    
    updateProductByIdReq({id, name, price, description, quantity, type_id}) {
        return instance.put(`/updateProduct/${id}`, {name, price, description, quantity, type_id})
    },
    deleteProductById: (id) => {
        return instance.delete(`/delProduct/${id}`)
    },
    recoveryProductById({id}) {
        return instance.put(`/recoveryProduct/`, {id});
    },
    deleteTypeById: (id) => {
        return instance.delete( `/delType/${id}` )
    },
    addNewCharacteristcsReq({characteristics}) {
        return instance.post(`/addNewCharacteristcs`, {characteristics});
    },
    deleteCharacteristcsReq({characteristics}) {
        return instance.post(`/delCharacteristics`, {characteristics});
    },
    changeProductCharacteristics({characteristics, productId}) {
        return instance.put('/updateProductCharacteristics', {characteristics, productId});
    },
    getProductForSearchBarReq({search}) {
        return instance.post(`/getProductForSearchBar`, {search});
    },
    getShortProductInfoReq({id}) {
        return instance.get(`/getShortProductInfoBy/${id}`);
    },
    addProductToFavorites({ productId, userId }) {
        return instance.post('/addProductToFavorities', { productId, userId });
    },
    getExistingStatus( { productId, userId } ) {
        return instance.post('/getExistingStatus', { productId, userId });
    },
    getProductIdFromFavoritiesByUserIdReq({ id }) {
        return instance.get(`/getPrductsIdForFavoritesByUser/${id}`);
    },
    getProductStatus({ productId, userId }) {
        return instance.post(`/areProductInOrder`, { productId, userId })
    },
    deleteProductCharacteristic({characteristicId, productId}) {
        return instance.post(`/delProductCharacteristic`, {characteristicId, productId});
    },
}

export const ReviewsAPI = {
    getReviewsInfoReq({id}) {
        return instance.get(`/getProductReviewsBy/${id}`);
    },
    addNewReview({ product_id, user_id, title, text, rating }) {
        return instance.post( `/addNewReview`, { product_id, user_id, title, text, rating });

    },
    deleteReview: (id) => {
        return instance.delete(`/delReview/${id}`);
    },
    updateReviewReq( {id, title, text, rating} ) {
        return instance.put(`/updateReview`, {id, title, text, rating});
    },

}

export const AuthAPI = {    
    loginReq({login, password}) {
        return instance.get(`/login/${login}/${password}`).then(e => {
            localStorage.setItem('user', JSON.stringify(
                {
                    'id': e.data.id,
                    'login': e.data.login,
                    'password': e.data.password,
                    'name': e.data.first_name,
                    'surname': e.data.last_name,
                    'email': e.data.email,
                    'phone': e.data.phone_number,
                    'status': e.data.status
                }
            ))
        });
    },
    registrationReq({login, email, name, surname, password, phone}) {
        return instance.post('/registration', {login, email, name, surname, password, phone}).then(() => {this.loginReq({'login': login, 'password': password})});
    },
    sendVerificationEmail: (email) => {return instance.post('/send-verification-email', { email })},
    verifyCode: (code) => {return instance.post('/verify-code', { code })},
}
export const BasketAPI = {
    getBasket({user_id}) {
        return instance.get(`/getBasketIdOrAddNew/${user_id}`)
    },
    getProductsInCompaundReq({order_id}) {
        return instance.get(`/getProductsInCompaund/${order_id}`)
    },
    updateCompoundCount({id, newCount}) {
        return instance.put(`/updateCompoundOf/${id}`, {newCount})
    },
    deleteCompoundById: ({id}) => {
        return instance.delete(`/delCompound/${id}`)
    },
    addProduct({product_id, order_id, count}) {
        return instance.post(`/addProductToBasket`, {product_id, order_id, count})
    },
    updateOrder({id, price, payment_id}) {
        return instance.put(`/updateOrderOf/${id}`, {price, payment_id})
    },
    getCountOfProductsReq({userId}) {
        return instance.get(`/getCountOfProductsInBasket/${userId.user_id}`);
    },
    getShopDeliveryInfoReq() {
        return instance.get(`/getShopDeliveryInfo`);
    },
    getUserDeliveryInfoReq({userId}) {
        return instance.get(`/getUserDeliveryInfo/${userId}`);
    },
    getUserPaymentByIdReq({id}) {
        return instance.get(`/getUserPaymentBy/${id}`);
    },
    getUserDeliveryByIdReq({id}) {
        return instance.get(`/getUserDeliveryInfoBy/${id}`);
    },
    getShopDeliveryByIdReq({id}) {
        return instance.get(`/getShopDeliveryInfoBy/${id}`);
    },
    addDeliveryReq({user_address_id, shop_address_id, order_id}) {
        return instance.post(`/addNewDelivery`, {user_address_id, shop_address_id, order_id});
    },
    getUserOrderInfoByIdReq({id}) {
        return instance.get(`/getUserOrderBy/${id}`);
    },
    addUserAddress({address, name, surname, email, phone, user_id, price}) {
        return instance.post('/addNewUserDelivery', {address, name, surname, email, phone, user_id, price});
    },
    deleteUserAddressById: (id) => {
        return instance.delete( `/delUserDelivery/${id}` );
    },
    getOrderStatusesByIdReq({id}) {
        return instance.get(`/getOrderStatusesBy/${id}`);
    },
}
export const PDFAPI = {
    generateInvoicePDF({items, total}){
        return instance.post('/generatePDF', {items, total})
    },
    salesReport({start_date, end_date}) {
        return instance.post('/getsalesReport', {start_date, end_date}); 
    },
    demandReport() {
        return instance.get('/getdemandReport');
    },
    customerReport({price}) {
        return instance.post('/getCustomersByOrderPrice', {price});
    },
}
export const PhotoAPI = {
    uploadPhotoReq({ formData, productId }) {
      return instance.post(`/uploadPhoto/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    getPhotoesUrlReq(productId) {
        return instance.get(`/getPhotoesUrl/${productId}`);
    },
    getPhotoUrlReq(productId) {
        return instance.get(`/getPhotoUrl/${productId}`);
    },
    deletePhotoByIdAndUrl: ({id, url}) => {
        return instance.delete( `/delPhoto/${id}`, { data: {url}});
    },
    getPhotoForCatalog({id}) {
        return instance.get(`/getPhotoByType/${id}`);
    },
  };
export const CompareAPI = {
    getCompareItemsReq({id}) {
        return instance.get(`/getUserCompare/${id}`);
    },
    getAreProductInComapre({ productId, userId }) {
        return instance.post(`/getExistingCompare`, { productId, userId });
    },
    addProductInCompare({ productId, userId }) {
        return instance.post(`/addProductToCompare`, { productId, userId });
    },
    deleteProductFromCompareReq({ productId, userId }) {
        return instance.post(`/deleteProductFromCompare`, { productId, userId });     
    },
    deleteProductFromFavoritesReq({ productId, userId }) {
        return instance.post(`/deleteProductFromFavorites`, { productId, userId });
    },
}