package com.tomcat.checkmarket.di

import androidx.room.Room
import com.tomcat.checkmarket.api.MarketApi
import com.tomcat.checkmarket.data.db.AppDatabase
import com.tomcat.checkmarket.data.repository.TokenRepository
import com.tomcat.checkmarket.ui.TokenViewModel
import okhttp3.OkHttpClient
import org.koin.android.ext.koin.androidContext
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

val appModule = module {
    single {
        OkHttpClient.Builder().build()
    }

    single {
        Retrofit.Builder()
            .baseUrl("https://platform.fintacharts.com/")
            .client(get())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(MarketApi::class.java)
    }

    single {
        Room.databaseBuilder(
            androidContext(),
            AppDatabase::class.java, "app_database"
        ).build()
    }

    single {
        get<AppDatabase>().authTokenDao()
    }

    single {
        TokenRepository(get(), get())
    }

    viewModel {
        TokenViewModel(get())
    }
}