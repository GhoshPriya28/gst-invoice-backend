const {Items,User} = require('../../sql-connections/models');
const { body,validationResult } = require("express-validator");
const {success,error,customResponse,validation} = require("../../helpers/response/api-response.js");
const {getProductsResponseData} = require('../../helpers/response/parse-response');
const { v4: uuidv4 } = require('uuid');
const items = require('../../sql-connections/models/items');

// add product
// add product
exports.addProduct = [
    body("userId").isLength({ min: 1 }).trim().withMessage("User Id must be specified."),
    body("product_name").isLength({ min: 1 }).trim().withMessage("Product name must be specified."),
    body("product_unit").isLength({ min: 1 }).trim().withMessage("Product unit must be specified."),
    body("selling_price").isLength({ min: 1 }).trim().withMessage("Product selling price must be specified."),
    body("type").isLength({ min: 1 }).trim().withMessage("Product type must be specified."),
    body("description").isLength({ max: 25 }).withMessage("Description must be 25 words."),
    async (req, res) =>{
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
            {
                customResponse(res, 1, errors.array()[0].msg);
            }
            else
            {
                await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                    if(!userDetails)
                    {
                        customResponse(res,1,"User not forunf in our system")
                    }
                    else
                    {
                        const product = {
                            product_id:uuidv4(),
                            user_id:req.body.userId?req.body.userId:"",
                            product_name:req.body.product_name,
                            product_unit:req.body.product_unit,
                            selling_price:req.body.selling_price,
                            description:req.body.description,
                            type:req.body.type,
                            hsn:req.body.hsn,
                            hac:req.body.hac,
                            item_code:req.body.item_code,
                        }

                        await Items.create(product).then(async productSaveDetails => {
                            success(res, 200,"Product added Successfully.");
                        }).catch(err => {
                            error(res, 500, err);
                        })
                    }
                }).catch(userDetaislError => {
                    customResponse(res,1,userDetaislError)
                })
            }
        }catch(err){
            error(res, 500, err);
        }
    }
];
//update product
//update product
exports.updateProduct = [    
    body("userId").isLength({ min: 1 }).trim().withMessage("User id must be specified."),
    body("productId").isLength({ min: 1 }).trim().withMessage("Product id must be specified."),
    body("description").isLength({ max: 25 }).withMessage("Description must be 25 words."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                customResponse(res, 1, errors.array()[0].msg);
            }
            else
            {
                await User.findOne({ where: { user_id: req.body.userId } }).then(async userDetails => {
                    if(!userDetails)
                    {
                        customResponse(res,1,"User Not Found in Our System.")
                    }
                    else
                    {
                        Items.findOne({ where: { product_id: req.body.productId, user_id: req.body.userId } }).then((data) =>{
                              if (data)
                              {
                                let updateData = { 
                                    product_name:req.body.product_name, 
                                    product_unit:req.body.product_unit, 
                                    selling_price:req.body.selling_price,
                                    description:req.body.description,
                                    type:req.body.type,
                                    hsn:req.body.hsn?req.body.hsn:'',
                                    hac:req.body.hac?req.body.hac:'', 
                                    item_code:req.body.item_code,
                                  }
                                Items.update(updateData, { where: { product_id: req.body.productId }}).then(productdata =>{
                                    success(res, 200,"Product updated Successfully.", productdata);
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
                }).catch(userDetaislError => {
                    customResponse(res,1, "User not found in our system.")
                }) 
            }
        } catch(err){
            error(res, 500, err);
        }
    }
]
// get all product
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

            await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                if(!userDetails)
                {
                    customResponse(res,1,"User Not Found in Our System.")
                }
                else
                {
                    Items.findAndCountAll({where:{user_id: req.query.userId,is_deleted:'0'}, offset: pagingOffset, limit: pagingLimit, order: [['id', 'DESC']]}).then(async productList => {
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
            }).catch(userDetaislError => {
                customResponse(res,1,userDetaislError)
            })
        }  
    }
    catch(err)
    {
        customResponse(res, 1, err);
    }
}

//Items List
exports.getAllProductList= async (req, res) => {
    try
    {
        var finalProductList = []
        await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
            if(!userDetails)
            {
                customResponse(res,1,"User Not Found in Our System.")
            }
            else
            {
                Items.findAll({where:{user_id: req.query.userId,is_deleted:'0'}}).then(async productList => {
                    for(let i=0; i< productList.length; i++)
                    {
                        const finalProductDetails = await getProductsResponseData(productList[i])
                        finalProductList.push(finalProductDetails)
                    }
                    success(res,200,'Product List',finalProductList);
                }).catch(productListError => {
                    customResponse(res,1,productListError)
                })
            }
        }).catch(userDetaislError => {
            customResponse(res,1,userDetaislError)
        })
    }
    catch(err)
    {
        customResponse(res, 1, err);
    }
}

//get product details
exports.GetByProductId = async (req, res) => {
    try {
        if (req.query.productId =='')
        {
            customResponse(res, 1, 'Please provide product id.');
        }
        else
        {
            await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                if(!userDetails)
                {
                    customResponse(res,1,"User Not Found in Our System.")
                }
                else
                {
                    const productDetails = await Items.findOne({ where: {  user_id: req.query.userId, product_id: req.query.productId } });
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
            }).catch(userDetaislError => {
                customResponse(res,1,userDetaislError)
            })
        }

        
    } catch (err) {
        customResponse(res,1,err.message);
    }
}

//delete product
exports.deleteByProductId = [
    async (req, res)=>{ 
        try{
            if(req.query.productId =='')
            {
               customResponse(res, 1, 'Please provide product id.');
            }
            else
            {    
                await User.findOne({ where: { user_id: req.query.userId } }).then(async userDetails => {
                    if(!userDetails)
                    {
                        customResponse(res,1,"User Not Found in Our System.")
                    }
                    else
                    {
                        Items.findOne({ where: {product_id : req.query.productId,user_id: req.query.userId}}).then((data) => {
                            //const data = await Items.findOne({ where: { product_id: req.query.productId } });
                            if(data)
                            {
                                let updateProduct = {is_deleted:1};
                                Items.update(updateProduct, { where: {product_id : req.query.productId,user_id: req.query.userId}}).then(productdata => {
                                    success(res, 200,"Product deleted Successfully.",productdata);
                                }).catch(err => {
                                    error(res, 500, err);
                                })
                            }
                            else
                            {
                                error(res, 404, "Product not exists with this id");
                            }         
                        }).catch(itemFindError => {
                            error(res, 500, itemFindError);
                        })
                    }
                }).catch(userDetaislError => {
                    customResponse(res,1,userDetaislError)
                })   
            }       
        } catch (err) {
            error(res, 500, err);
        }
    }
]

