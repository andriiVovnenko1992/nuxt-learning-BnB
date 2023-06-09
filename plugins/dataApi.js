import { getErrorResponse, unWrap  } from '../utils/fetchUtils';

export default function({ $config }, inject) {
    const APP_ID = $config.algolia.appId;
    const API_KEY = $config.algolia.key;
    const headers = {
        'X-Algolia-API-Key': API_KEY,
        'X-Algolia-Application-Id': APP_ID,
    };
    const algoliaUrl = `https://${APP_ID}-dsn.algolia.net`;

    inject('dataApi', {
        getHome,
        getReviewsByHomeId,
        getUserByHomeId,
        getHomesByLocations,
    });

    async function getHome(homeId) {
        try {
            const response = await fetch(
                `${algoliaUrl}/1/indexes/homes/${homeId}`,
                { headers }
            );
            const data = await unWrap(response);
            return data;
        } catch (error) {
            return getErrorResponse(error);
        }
    }

    async function getReviewsByHomeId(homeId) {
        try {
            const response = await fetch(
                `${algoliaUrl}/1/indexes/reviews/query`,
                {
                    headers,
                    method: 'POST',
                    body: JSON.stringify({
                        filters: `homeId:${homeId}`,
                        hitsPerPage: 2,
                        attributesToHighlight: [],
                    }),
                },
            );
            const data = await unWrap(response);

            return data;
        } catch(error) {
            return getErrorResponse(error);
        }
    }

    async function getUserByHomeId(homeId) {
        try {
            const response = await fetch(
                `${algoliaUrl}/1/indexes/users/query`,
                {
                    headers,
                    method: 'POST',
                    body: JSON.stringify({
                        filters: `homeId:${homeId}`,
                        attributesToHighlight: [],
                    }),
                },
            );

            const data = await unWrap(response);

            return data;
        } catch(error) {
            return getErrorResponse(error);
        }
    }

    async function getHomesByLocations(lat, lng, radiusInMeters = 1500) {
        try {
            const response = await fetch(
                `${algoliaUrl}/1/indexes/homes/query`,
                {
                    headers,
                    method: 'POST',
                    body: JSON.stringify({
                        aroundLatLng: `${lat},${lng}`,
                        aroundRadius: radiusInMeters,
                        hitsPerPage: 10,
                        attributesToHighlight: [],
                    }),
                },
            );
            
            const data = await unWrap(response);

            return data;
        } catch(error) {
            return getErrorResponse(error);
        }
    }
};