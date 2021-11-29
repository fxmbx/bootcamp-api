const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
//@route GET /api/v1/bootcamps 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    //copy req query 
    let reqQuery = { ...req.query };
    //create a query string
    let queryString = JSON.stringify(reqQuery)
    // console.log(queryString)

    //array of fields to exclude
    const removeField = ['select', 'sort', 'page', 'limit']

    //Loop over removefields and delete from the request query 

    removeField.forEach(x => delete reqQuery[x])
    console.log(reqQuery)
    // let queryString = JSON.stringify(req.query)

    //create operators for greater than $gt, lessthan $lt, etc 
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    // console.log('filter : \n ', queryString)

    //finding resource
    query = Bootcamp.find(JSON.parse(queryString)).populate({ path: 'courses', select: 'title' })

    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
        console.log(fields)
    }
    //sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 100
    const startIndex = (page - 1) * limit
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments()
    query = query.skip(startIndex).limit(limit)

    //pagination result 
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    //executin query
    const bootcamps = await query;
    res.status(200).json({
        pagination,
        count: bootcamps.length,
        success: true,
        data: bootcamps
    })

})
//@route GET /api/v1/bootcamps/:id

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const removefield = ['select', 'sort', 'limit', 'page']
    let quey;
    let reqQuery = JSON.stringify(req.query)
    query = Bootcamp.findById(req.params.id)
    if (req.query.select) {

    }
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        // res.status(400).json({
        //     success: false,
        //     Error: 'Bootcamp no de our db'
        // })
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

        return
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

//@route POST /api/v1/bootcamps/

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp })

});

//@route PUT /api/v1/bootcamps/:id

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp with id ${req.params.id} no de db`, 404))
        return
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })

})

//@route DELTE /api/v1/bootcamps/:id
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if (!bootcamp) {
            next(new ErrorResponse(`Bootcamp with id ${req.params.id} no de db`, 404))

            return
        }
        bootcamp.remove()

        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {
        next(err)

    }
}

//GET bootcamp withing a radius 
//@route DELTE /api/v1/bootcamps/radius/:ripcode/:distance
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    //get lang and long from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calculate radius using radian...Divide dist by radius of earth
    //earth radius = 3,963m / 6,378km

    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})