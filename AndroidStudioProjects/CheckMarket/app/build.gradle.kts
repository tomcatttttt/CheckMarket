plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("kapt")
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0"
}

android {
    compileSdk = 34
    namespace = "com.tomcat.checkmarket"

    defaultConfig {
        applicationId = "com.tomcat.checkmarket"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.2"
    }
}

dependencies {
    // Core libraries
    implementation(libs.androidx.core.ktx.v1120)
    implementation(libs.androidx.lifecycle.runtime.ktx.v262)
    implementation(libs.androidx.activity.compose.v193)

    //noinspection UseTomlInstead
    implementation("androidx.compose.ui:ui:1.7.4")
    //noinspection UseTomlInstead
    implementation("androidx.compose.ui:ui-tooling-preview:1.7.4")
    implementation(libs.material3)

    //noinspection UseTomlInstead
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    //noinspection UseTomlInstead
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")

    implementation(libs.androidx.room.runtime)
    kapt(libs.androidx.room.compiler)
    implementation(libs.androidx.room.ktx)
    // Koin for dependency injection
    implementation(libs.koin.android)
    implementation(libs.koin.androidx.compose)

    // OkHttp for WebSocket
    implementation(libs.okhttp)

    // Gson for JSON parsing
    //noinspection UseTomlInstead
    implementation("com.google.code.gson:gson:2.10.1")

    // Testing libraries
    testImplementation(libs.junit)
    androidTestImplementation(libs.junit.v115)
    androidTestImplementation(libs.espresso.core.v351)
    androidTestImplementation(libs.ui.test.junit4)

    // Debugging tools
    debugImplementation(libs.ui.tooling)
    debugImplementation(libs.ui.test.manifest)
}