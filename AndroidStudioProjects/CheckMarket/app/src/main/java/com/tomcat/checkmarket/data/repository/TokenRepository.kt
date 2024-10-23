package com.tomcat.checkmarket.data.repository

import com.tomcat.checkmarket.api.MarketApi
import com.tomcat.checkmarket.data.db.AuthTokenDao
import com.tomcat.checkmarket.model.AuthToken
import android.util.Log

class TokenRepository(
    private val api: MarketApi,
    private val authTokenDao: AuthTokenDao
) {

    suspend fun getTokenFromDb(): AuthToken? {
        Log.d("TokenRepository", "Getting token from DB...")
        return authTokenDao.getAuthToken()
    }

    suspend fun saveTokenToDb(authToken: AuthToken) {
        Log.d("TokenRepository", "Saving token to DB: ${authToken.token}")
        authTokenDao.insertToken(authToken)
    }

    suspend fun fetchTokenFromApi(): String {
        Log.d("TokenRepository", "Fetching new token from API...")
        val response = api.getToken()
        return response.accessToken ?: throw Exception("Token not found in API response")
    }
}