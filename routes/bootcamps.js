const express = require('express')

const { getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius } = require('../controllers/bootcamps')

//include other resource router
const courseRouter = require('./courses')

const router = express.Router();

//reroute into other resource route
router.use('/:bootcampId/courses', courseRouter)

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

// router.get('/', (req, res)=>{
//     res.status(200).json({success : true,
//         messgae : 'show all bootcamps', 
//        })
// })
// router.get('/:id', (req, res)=>{
//     res.status(200).json({success : true,
//         messgae : `'get bootcamp' ${req.params.id}`, 
//        })
// })

// router.post('/', (req, res)=>{
//     res.status(200).json({success : true,
//         messgae : 'post bootcamps', 
//        })
// })

// router.put('/:id', (req, res)=>{
//     res.status(200).json({success : true,
//         messgae : `'update bootcamps' ${req.params.id}`, 
//        })
// })

// router.delete('/:id', (req, res)=>{
//     res.status(200).json({success : true,
//         messgae : `delete bootcamps ${req.params.id}`, 
//        })
// })

module.exports = router;