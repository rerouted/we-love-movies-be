const db = require('../db/connection')
const mapProperties = require('../utils/map-properties')

const criticsProps = mapProperties({
	organization_name: 'critic.organization_name',
	preferred_name: 'critic.preferred_name',
	surname: 'critic.surname',
})

const tableName = 'reviews'

async function destroy(reviewId) {
	return db(tableName).where({ review_id: reviewId }).del()
}

async function read(reviewId) {
	return db(tableName).select('*').where({ review_id: reviewId }).first()
}

async function update(review) {
	return db(tableName)
		.select('*')
		.where({ review_id: review.review_id })
		.update(review)
}

const readUpdatedReview = (reviewId) => {
	return db(tableName)
		.join('critics', 'critics.critic_id', 'reviews.critic_id')
		.select('*')
		.where({ review_id: reviewId })
		.first()
		.then(criticsProps)
}

module.exports = {
	destroy,
	read,
	update,
	readUpdatedReview,
}
