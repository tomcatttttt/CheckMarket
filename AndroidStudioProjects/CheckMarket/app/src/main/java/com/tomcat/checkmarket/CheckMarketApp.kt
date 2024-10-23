package com.tomcat.checkmarket

import android.app.Application
import com.tomcat.checkmarket.di.appModule
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

class CheckMarketApp : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@CheckMarketApp)
            modules(appModule)
        }
    }
}