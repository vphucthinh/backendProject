class PaginationMapper {
    static toPagination(data, count, page, perPage) {
        return {
            data,
            current: page,
            pages: Math.ceil(count / perPage),
            pre: Math.max(Math.min(page - 1, Math.ceil(count / perPage)), 1),
            next: Math.min(page + 1, Math.ceil(count / perPage)),
        };
    }

    static fromRequest(req) {
        return {
            page: req.query.page || 1,
            perPage: req.query.perPage || 10,
        };
    }
}

export default PaginationMapper;
