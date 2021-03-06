export default {
    async registerCoach(context, data) {
        const userId = context.rootGetters.userId;
        const coachData = {
            firstName: data.first,
            lastName: data.last,
            hourlyRate: data.rate,
            areas: data.areas,
            description: data.desc
        };

        const token = context.rootGetters.getToken;
        const response = await fetch(`https://testing-coach-store-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` + token, {
            method: 'PUT',
            body: JSON.stringify(coachData)
        });

        // const responseData = await response.json();

        if (!response.ok) {
            //error
        }

        context.commit('registerCoach', {
            ...coachData,
            id: userId
        });
    },
    async loadCoaches(context, payload) {
        if(!payload.forceRefresh && !context.getters.shouldUpdate) {
            return;
        }
        const response = await fetch(`https://testing-coach-store-default-rtdb.firebaseio.com/coaches.json`);
        const responseData = await response.json();

        if(!response.ok) {
            const error = new Error(response.message || 'Failed to load data! Please check your network connection');
            throw error
        }

        const coaches = [];

        for(const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas,
                description: responseData[key].description
            };
            coaches.push(coach);
        }
        context.commit('setCoaches', coaches);
        context.commit('setFetchTimestamp');
    }
}