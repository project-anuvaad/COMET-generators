module.exports = ({ Model, Router }) => {
    // CRUD routes
    Router.get('/', (req, res) => {
        const { sort, skip, limit, one, ...rest } = req.query;
        let q;
        if (!rest || Object.keys(rest || {}).length === 0) {
            return res.json([]);
        }

        Object.keys(rest).forEach((key) => {
            if (key.indexOf('$') === 0) {
                const val = rest[key];
                rest[key] = [];
                Object.keys(val).forEach((subKey) => {
                    val[subKey].forEach(subVal => {
                        rest[key].push({ [subKey]: subVal })
                    })
                })
            }
        })
        console.log(rest)
        if (one) {
            q = Model.findOne(rest);
        } else {
            q = Model.find(rest);
        }
        if (sort) {
            Object.keys(sort).forEach(key => {
                q.sort({ [key]: parseInt(sort[key]) })
            })
        }
        if (skip) {
            q.skip(parseInt(skip))
        }
        if (limit) {
            q.limit(parseInt(limit))
        }
        q.then((documents) => {
            return res.json(documents);
        })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })

    Router.post('/', (req, res) => {
        const data = req.body;
        Model.create(data)
            .then((document) => {
                return res.json(document);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })

    Router.patch('/', (req, res) => {
        let { conditions, values, options } = req.body;
        if (!options) {
            options = {};
        }
        Model.update(conditions, { $set: values }, { ...options, multi: true })
            .then(() => Model.find(conditions))
            .then(documents => {
                return res.json(documents);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })

    Router.delete('/', (req, res) => {
        let conditions = req.body;
        let documents;
        Model.find(conditions)
            .then((a) => {
                documents = a;
                return Model.remove(conditions)
            })
            .then(() => {
                return res.json(documents);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })

    Router.get('/:id', (req, res) => {
        Model.findById(req.params.id)
            .then((document) => {
                return res.json(document);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })

    Router.patch('/:id', (req, res) => {
        const { id } = req.params;
        const changes = req.body;
        Model.findByIdAndUpdate(id, { $set: changes })
            .then(() => Model.findById(id))
            .then(document => {
                return res.json(document);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })

    Router.delete('/:id', (req, res) => {
        const { id } = req.params;
        let deletedArticle;
        Model.findById(id)
            .then(document => {
                deletedArticle = document;
                return Model.findByIdAndRemove(id)
            })
            .then(() => {
                return res.json(deletedArticle);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send(err.message);
            })
    })



    return Router;
}