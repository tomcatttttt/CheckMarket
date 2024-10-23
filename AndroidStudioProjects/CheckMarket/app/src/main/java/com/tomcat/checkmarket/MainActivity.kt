package com.tomcat.checkmarket

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import com.tomcat.checkmarket.ui.MainScreen
import com.tomcat.checkmarket.ui.TokenViewModel
import com.tomcat.checkmarket.ui.theme.CheckMarketTheme
import org.koin.androidx.viewmodel.ext.android.viewModel

class MainActivity : ComponentActivity() {

    private val tokenViewModel: TokenViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            CheckMarketTheme {
                Surface(
                    color = MaterialTheme.colorScheme.background
                ) {
                    LaunchedEffect(Unit) {
                        tokenViewModel.getToken()
                    }

                    MainScreen()
                }
            }
        }
    }
}