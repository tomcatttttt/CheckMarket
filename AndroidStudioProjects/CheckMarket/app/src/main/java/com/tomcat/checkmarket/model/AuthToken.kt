package com.tomcat.checkmarket.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "auth_token")
data class AuthToken(
    @PrimaryKey val id: Int = 0,
    val token: String
)