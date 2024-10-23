package com.tomcat.checkmarket.data.db

import androidx.room.Database
import androidx.room.RoomDatabase
import com.tomcat.checkmarket.model.AuthToken

@Database(entities = [AuthToken::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun authTokenDao(): AuthTokenDao
}