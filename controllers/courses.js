const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


//@route GET /api/v1/courses
//       GET /api/v1/bootcamps/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, nex) => {

    let query;
    let reqQuery = { ...req.query }
    let queryString = JSON.stringify(reqQuery)
    let removefield = ['select', 'sort', 'limit', 'page']
    removefield.forEach(x => delete (reqQuery[x]))
    console.log(queryString)

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description housing'
        })
    }
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find(JSON.parse(queryString)).populate({
            path: 'bootcamp',
            select: 'name description housing'
        })
    }
    // query = Course.find(JSON.parse(queryString))
    console.log(req.query)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
        console.log(fields)
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)

    } else {
        query = query.sort('-tuition')
    }
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 100
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Course.countDocuments()
    query = query.skip(startIndex).limit(limit)
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
    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        pagination,
        data: courses
    })
})


exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({ path: 'bootcamp', select: 'name description' })

    if (!course) {
        next(new ErrorResponse(`No course with Id ${res.params.id}`, 404))
        return
    }
    res.status(200).json({ success: true, data: course })
})

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        next(new ErrorResponse(`No bootcamp with Id ${res.params.bootcampId} exist`, 404))
        return
    }
    const course = await Course.create(req.body)
    res.status(200).json({ success: true, data: course })
})
