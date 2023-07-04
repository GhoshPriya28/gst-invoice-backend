const {Items} = require('../../sql-connections/models');
const { body,validationResult } = require("express-validator");
const {success,error,customResponse,validation} = require("../../helpers/response/api-response.js");
const {getProductsResponseData} = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');


exports.addProduct = [
    body("product_name").isLength({ min: 1 }).trim().withMessage("Product name must be specified."),
    body("product_unit").isLength({ min: 1 }).trim().withMessage("Product unit must be specified."),
    body("selling_price").isLength({ min: 1 }).trim().withMessage("Product selling price must be specified."),
	body("type").isLength({ min: 1 }).trim().withMessage("Product type must be specified."),
    async (req, res) =>{
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
            {
                validation(res, errors.array()[0].msg, errors.array());
            }
            else
            {
                const product = {
                    product_id:uuidv4(),
                    product_name:req.body.product_name,
                    product_unit:req.body.product_unit,
                    selling_price:req.body.selling_price,
                    description:req.body.description,
                    type:req.body.type
                }

                await Items.create(product).then(async productSaveDetails => {
                    success(res, 200,"Product added Successfuly.");
                }).catch(err => {
                    error(res, 500, err);
                })
            }
        }catch(err){
            error(res, 500, err);
        }
    }
];

exports.updateProduct = [
    body("productId").isLength({ min: 1 }).trim().withMessage("Product id must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                validation(res, errors.array()[0].msg, errors.array());
            }
            else
            {
                Items.findOne({ where: { product_id: req.body.productId } }).then((data) =>{
                      if (data)
                      {
                        let updateData = { product_name:req.body.product_name, product_unit:req.body.product_unit, selling_price:req.body.selling_price, description:req.body.description, type:req.body.type }
                        Items.update(updateData, { where: { product_id: req.body.productId }}).then(productdata =>{
                            success(res, 200,"Product updated Successfuly.", productdata);
                        }).catch(err => {
                            error(res, 500, err);
                        });
                      }
                      else
                      {
                        error(res, 404, "Product not exists with this id");
                      }
                }).catch(err => {
                    error(res, 500, err);
                });    
            }
        } catch(err){
            error(res, 500, err);
        }
    }
]

exports.getAllProducts = async (req, res) => {
    try
    {    
        if (req.query.pageNum =='')
        {
            customResponse(res, 1, 'Please provide Page Number.');
        }
        else
        {
            let pagingLimit = 10;
            let numberOfRows, numberOfPages;
            let numberPerPage = parseInt(pagingLimit,10) || 1;
            let pageNum = parseInt(req.query.pageNum, 10) || 1;
            let pagingOffset = (pageNum - 1) * numberPerPage;
            var offset = pagingLimit * ((parseInt(req.query.pageNum,10) - 1));
        
            var finalProductList = []
            var finalDetails = {}

            Items.findAndCountAll({offset: pagingOffset, limit: pagingLimit}).then(async productList => {
                numberOfRows = productList.count
                numberOfPages = Math.ceil(parseInt(numberOfRows,10) / numberPerPage);
                const pagination = {
                    current: pageNum,
                    numberPerPage: numberPerPage,
                    has_previous: pageNum > 1,
                    previous: pageNum - 1,
                    has_next: pageNum < numberOfPages,
                    next: pageNum + 1,
                    last_page: Math.ceil(parseInt(numberOfRows,10) / pagingLimit)
                }
                allProductsList = productList.rows
                for(let i=0; i< allProductsList.length; i++)
                {
                    const finalProductDetails = await getProductsResponseData(allProductsList[i])
                    finalProductList.push(finalProductDetails)
                }
           
                finalDetails.pagination = pagination
                finalDetails.productList = finalProductList
                success(res,200,'Product List',finalDetails);
            }).catch(productListError => {
                customResponse(res,1,productListError)
            })
        }  
    }
    catch(err)
    {
        customResponse(res, 1, err);
    }
}

exports.GetByProductId = async (req, res) => {
    try {
        if (req.query.productId =='')
        {
            customResponse(res, 1, 'Please provide product id.');
        }
        else
        {
            const productDetails = await Items.findOne({ where: { product_id: req.query.productId } });
           if(productDetails)
            {

                const finalProductDetails = await getProductsResponseData(productDetails)
                success(res,200,'Product Details',finalProductDetails)
            }
            else
            {
                customResponse(res,1,'No Product Found with this product id in our system.');
            }
        }

        
    } catch (err) {
        customResponse(res,1,err.message);
    }
}

exports.deleteByProductId = [
    async (req, res)=>{ 
        try{
            if(req.query.productId =='')
            {
               customResponse(res, 1, 'Please provide product id.');
            }
            else
            {
                var id = {product_id : req.query.productId};
    
                Items.findOne({ where:id }).then((data) =>{
                    //const data = await Items.findOne({ where: { product_id: req.query.productId } });
                    if(data)
                    {
                        let updateProduct = {is_deleted:1};
                        Items.update(updateProduct, { where: id }).then(productdata => {
                            success(res, 200,"Product deleted Successfuly.",productdata);
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                    else
                    {
                        error(res, 404, "Product not exists with this id");
                    }         
                })       
            }       
        } catch (err) {
            error(res, 500, err);
        }
    }
]

