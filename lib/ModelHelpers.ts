﻿/// <reference path="../_references.d.ts" />
import MongoDB = require('mongodb');
import Model = require('./Model');
import skmatc = require('skmatc');
import Omnom = require('./utils/Omnom');
import _ = require('lodash');
import Bluebird = require('bluebird');

export = ModelHelpers;

class ModelHelpers<TDocument extends { _id?: any }, TInstance> {
    constructor(public model: Model<TDocument, TInstance>) {
        this._validator = new skmatc(model.schema);
    }

    private _validator: Skmatc.Skmatc;

    /**
     * Validates a document to ensure that it matches the model's ISchema requirements
     * @param {any} document The document to validate against the ISchema
     * @returns {SkmatcCore.IResult} The result of the validation
     */
    validate(document: TDocument): Skmatc.Result {
        return this._validator.validate(document);
    }

    /**
     * Wraps the given document in an instance wrapper for use throughout the application
     * @param {any} document The document to be wrapped as an instance
     * @param {Boolean} isNew Whether the instance originated from the database or was created by the application
     * @param {Boolean} isPartial Whether the document supplied contains all information present in the database
     * @returns {any} An instance which wraps this document
     */
    wrapDocument(document: TDocument, isNew?: boolean, isPartial?: boolean): TInstance {
        return new this.model.Instance(document, isNew, isPartial);
    }

    /**
     * Performs a diff operation between two documents and creates a MongoDB changes object to represent the differences
     * @param {any} original The original document prior to changes being made
     * @param {any} modified The document after changes were made
     */
    diff(original: TDocument, modified: TDocument): any {
        var omnom = new Omnom();
        omnom.diff(original, modified);
        return omnom.changes;
    }
}
