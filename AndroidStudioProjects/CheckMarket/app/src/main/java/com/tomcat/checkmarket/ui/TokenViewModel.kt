package com.tomcat.checkmarket.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tomcat.checkmarket.data.repository.TokenRepository
import com.tomcat.checkmarket.model.AuthToken
import kotlinx.coroutines.launch
import android.util.Log

class TokenViewModel(
    private val repository: TokenRepository
) : ViewModel() {

    fun getToken() {
        viewModelScope.launch {
            val tokenFromDb = repository.getTokenFromDb()

            if (tokenFromDb == null) {
                Log.d("TokenViewModel", "Token not found in DB. Fetching new token...")
                try {
                    val newToken = repository.fetchTokenFromApi()
                    repository.saveTokenToDb(AuthToken(token = newToken))
                    Log.d("TokenViewModel", "New token fetched and saved: $newToken")
                } catch (e: Exception) {
                    Log.e("TokenViewModel", "Error fetching token: ${e.message}")
                }
            } else {
                Log.d("TokenViewModel", "Token found in DB: ${tokenFromDb.token}")
            }
        }
    }
}