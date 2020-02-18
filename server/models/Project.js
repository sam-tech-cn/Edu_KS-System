const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    assignee: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    project_code: {

        // @edu required and unique
        type: String, required: true, unique: true
    },
    design_start: {
        type: Date
    },
    design_end: {
        type: Date
    },
    design_perc: {
        type: mongoose.Decimal128
    },
    design_approval: {
        type: String,
        enum: ['TODO', 'NG', 'OK'],
        default: 'TODO'
    },
    coding_start: {
        type: Date
    },
    coding_end: {
        type: Date
    },
    coding_perc: {
        type: mongoose.Decimal128
    },
    coding_approval: {
        type: String,
        enum: ['TODO', 'NG', 'OK'],
        default: 'TODO'
    },
    testing_start: {
        type: Date
    },
    testing_end: {
        type: Date
    },
    testing_perc: {
        type: mongoose.Decimal128
    },
    testing_approval: {
        type: String,
        enum: ['TODO', 'NG', 'OK'],
        default: 'TODO'
    },
    release: {
        type: Date
    }
}, {
    versionKey: false
})

// @edu set toJSON as bellow the 'Decimal128' type will parse to float
ProjectSchema.set('toJSON', {
    transform: (doc, ret) => {
        
        // @edu forEach or Object.keys(ret).forEach(key =>{})
        Object.entries(ret).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object') {
                if (value.constructor.name === 'Decimal128') {
                    ret[key] = parseFloat(value.toString())
                }
            }
        })
        return ret
    }
})

module.exports = mongoose.model('Project', ProjectSchema)