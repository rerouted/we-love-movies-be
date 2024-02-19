const service = require('./reviews.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const methodNotAllowed = require('../errors/methodNotAllowed')

async function reviewExists(request, response, next) {
	const { reviewId } = request.params
	const review = await service.read(reviewId)

	if (review) {
		response.locals.review = review
		return next()
	}
	next({ status: 404, message: 'Review cannot be found.' })
}

async function destroy(request, response) {
	await service.destroy(response.locals.review.review_id)
	response.sendStatus(204)
}

function noMovieIdInPath(request, response, next) {
	if (request.params.movieId) {
		return methodNotAllowed(request, response, next)
	}
	next()
}

async function update(request, response) {
	const { review_id } = response.locals.review
	const updatedReview = {
		...request.body.data,
		review_id,
	}

	await service.update(updatedReview)
	const data = await service.readUpdatedReview(review_id)

	response.json({ data })
}

module.exports = {
	destroy: [
		noMovieIdInPath,
		asyncErrorBoundary(reviewExists),
		asyncErrorBoundary(destroy),
	],
	update: [
		noMovieIdInPath,
		asyncErrorBoundary(reviewExists),
		asyncErrorBoundary(update),
	],
}
