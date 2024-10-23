package com.tomcat.checkmarket.api

import com.tomcat.checkmarket.model.TokenResponse
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface MarketApi {

    @FormUrlEncoded
    @POST("identity/realms/fintatech/protocol/openid-connect/token")
    suspend fun getToken(
        @Field("grant_type") grantType: String = "password",
        @Field("client_id") clientId: String = "app-cli",
        @Field("username") username: String = "r_test@fintatech.com",
        @Field("password") password: String = "kisfiz-vUnvy9-sopnyv"
    ): TokenResponse
}