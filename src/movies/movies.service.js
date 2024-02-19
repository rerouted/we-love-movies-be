const db = require('../db/connection')
const mapProperties = require('../utils/map-properties')

const tableName = 'movies'

const criticsDetails = mapProperties({
	critic_id: 'critic.critic_id',
	preferred_name: 'critic.preferred_name',
	surname: 'critic.surname',
	organization_name: 'critic.organization_name',
})

async function list(is_showing) {
	return db(tableName)
		.select('movies.*')
		.modify((queryBuilder) => {
			if (is_showing) {
				queryBuilder
					.join(
						'movies_theaters',
						'movies.movie_id',
						'movies_theaters.movie_id'
					)
					.where({ 'movies_theaters.is_showing': true })
					.groupBy('movies.movie_id')
			}
		})
}

async function read(movie_id) {
	return db(tableName).select('*').where({ movie_id }).first()
}

async function readTheaters(movie_id) {
	return db('movies_theaters')
		.select('*')
		.join('theaters', 'movies_theaters.theater_id', 'theaters.theater_id')
		.where({ 'movies_theaters.movie_id': movie_id })
}

async function readReviews(movie_id) {
	return db('reviews')
		.select('*')
		.join('critics', 'critics.critic_id', 'reviews.critic_id')
		.where({ 'reviews.movie_id': movie_id })
		.then((obj) => {
			return obj.map((data) => {
				return criticsDetails(data)
			})
		})
}

module.exports = {
	list,
	read,
	readTheaters,
	readReviews,
}
