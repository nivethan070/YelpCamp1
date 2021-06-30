const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// const campgroundSchema = Joi.object({  //defining basic schema
//     campground:Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0), //price must be greater than zero
//         image: Joi.string().required(),
//         location: Joi.string().required(),
//         description: Joi.string().required() // title price image... all going to be required as well
//     }).required()     // joi.object() is the type // key campground because of body must include campground
//     });

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

    module.exports.campgroundSchema = Joi.object({  //defining basic schema
        campground:Joi.object({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0), //price must be greater than zero
            //image: Joi.string().required(),
            location: Joi.string().required().escapeHTML(),
            description: Joi.string().required().escapeHTML() // title price image... all going to be required as well
        }).required(),     // joi.object() is the type // key campground because of body must include campground
        deleteImages: Joi.array()    
    });

        module.exports.reviewSchema = Joi.object({
            review: Joi.object({
                rating: Joi.number().required().min(1).max(5),
                body: Joi.string().required().escapeHTML() //.htmlSafe()
            }).required()
        })

        // module.exports.reviewSchema = Joi.object({
        //     review: Joi.object ( {
        //         rating: Joi.number().required().min(1).max(5),
        //         body: Joi.string().required()
        //     } ) .required()
        // })