class BaseService {
    constructor(Repo, Name, PageMapper) {
        this.repo = Repo;
        this.name = Name;
        this.pageMapper = PageMapper;
    }

    /**
     * @description Retrieve multiple documents from the Model with the provided
     *   query
     * @param {number} [page] - Optional argument to page data
     * @param {number} [pageSize] - Optional argument to page size data
     * @param {object} [sort] - Optional argument to sort data
     * @returns {Promise} Returns the results of the query
     */
    getPage(page = 1, perPage = 10, sort = { _id: 1 }) {
        return this.repo.getPage(
            {},
            { __v: 0 },
            page,
            perPage,
            sort,
        ).then(([item, count]) => {
            const key = this.name || 'data';
            const result = {};
            result[key] = this.pageMapper(item, count, page, perPage);
            return result;
        });
    }

    /**
     * @description Retrieve a single document matching the provided ID, from the
     *   Model
     * @param {string} id  Required: ID for the object to retrieve
     * @returns {Promise} Returns the results of the query
     */
    getById(id) {
        return this.repo.findById(id);
    }

    /**
     * @description Create a new document on the Model
     * @param {object} body  Body object to create the new document with
     * @returns {Promise} Returns the results of the query
     */
    create(body) {
        return this.repo.create(body);
    }

    /**
     * @description Update a document matching the provided ID, with the body
     * @param {string} id  ID for the document to update
     * @param {object} body  Body to update the document with
     * @returns {Promise} Returns the results of the query
     */
    update(id, body) {
        return this.repo.update(id, body);
    }

    /**
     * @description Delete an existing document on the Model
     * @param {string} id  ID for the object to delete
     * @returns {Promise} Returns the results of the query
     */
    delete(id) {
        return this.repo.delete(id);
    }
}

export default BaseService;
