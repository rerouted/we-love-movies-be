const service = require('./movies.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

async function movieExists(request, response, next) {
	const movie = await service.read(request.params.movieId)

	if (movie) {
		response.locals.movie = movie
		return next()
	}
	next({ status: 404, message: `Movie cannot be found.` })
}

async function read(request, response) {
	response.json({ data: response.locals.movie })
}

async function readWithTheaters(request, response) {
	response.json({
		data: await service.readTheaters(response.locals.movie.movie_id),
	})
}

async function readWithReviews(request, response) {
	response.json({
		data: await service.readReviews(response.locals.movie.movie_id),
	})
}

async function list(request, response) {
	const is_showing = request.query.is_showing || false
	response.json({ data: await service.list(is_showing) })
}

module.exports = {
	list: [asyncErrorBoundary(list)],
	read: [asyncErrorBoundary(movieExists), read],
	readWithTheaters: [asyncErrorBoundary(movieExists), readWithTheaters],
	readWithReviews: [asyncErrorBoundary(movieExists), readWithReviews],
}
