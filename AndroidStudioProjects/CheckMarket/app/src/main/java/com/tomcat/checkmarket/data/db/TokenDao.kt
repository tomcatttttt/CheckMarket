package com.tomcat.checkmarket.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.tomcat.checkmarket.model.AuthToken

@Dao
interface AuthTokenDao {

    @Query("SELECT * FROM auth_token LIMIT 1")
    suspend fun getAuthToken(): AuthToken?

    @Insert
    suspend fun insertToken(authToken: AuthToken)
}