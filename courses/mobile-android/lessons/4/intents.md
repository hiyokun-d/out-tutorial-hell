---
id: "intents"
title: "Intents: Explicit and Implicit"
type: "THEORY"
xpReward: 20
module: "Navigation"
---

# Intents: Explicit and Implicit

Your Activities can't call each other directly. You never write `B()` yourself, because Android creates B. Instead you send an **Intent**, a message describing what you want. Android works out who should receive it.

Intents come in two kinds, and the difference is who picks the receiver.

## Explicit: "start *this* class"

You name the exact component. You use this inside your own app:

```kotlin
val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("recipeId", 42)
startActivity(intent)
```

`putExtra` attaches data. The receiver reads it back:

```kotlin
val id = intent.getIntExtra("recipeId", -1)   // -1 if it's missing
```

## Implicit: "somebody do *this*"

You describe an **action** and some **data**, not a class. Android finds every app that says it can handle that, and you don't need to know which apps are installed:

```kotlin
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://outth.hiyokun.dev"))
startActivity(intent)   // a browser opens it — whichever one the user has
```

If there are several matches, the user gets a chooser. If there's **no** match, `startActivity` throws `ActivityNotFoundException`, and your app crashes unless you catch it:

```kotlin
try {
    startActivity(intent)
} catch (e: ActivityNotFoundException) {
    Toast.makeText(this, "No app can open this", Toast.LENGTH_SHORT).show()
}
```

## The other half: `<intent-filter>`

How does Android know the browser handles web links? The browser **declares it** in its manifest. That declaration is an **intent filter**. It's the receiving side of every implicit intent, and your own app can declare one too:

```xml
<activity
    android:name=".ShareReceiverActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```

An intent reaches this Activity only if it passes all three tests:

- **action**: the intent's action is listed. Here, `SEND`.
- **category**: every category the intent carries is listed. `startActivity` always adds `DEFAULT`, so an Activity that wants implicit intents **must** list `DEFAULT`. Leave it out and your filter silently never matches.
- **data**: the type or URI fits. Here, plain text.

`android:exported="true"` lets other apps reach this Activity. Since Android 12, any Activity with an intent filter must set `exported` explicitly, or the app won't install.

Now "Share → Your App" appears when someone shares text from any other app.

## Getting a result back

Sometimes you start another screen to **get an answer**: the user picks a photo, a contact or a date. The old way was `startActivityForResult`, with the answer arriving in `onActivityResult`. That API is **deprecated**, for three reasons:

- Every result from every screen landed in **one method**, sorted by hand-made integer request codes.
- The data came back **untyped**, as an Intent you had to unpack and cast.
- It **broke across recreation**. If the phone rotated, or Android killed your process while the picker was open, the result could reach an object that no longer expected it.

The replacement is the **Activity Result API**. You register a callback once, with a typed **contract**:

```kotlin
class ProfileActivity : AppCompatActivity() {

    // Register as a property (or in onCreate) — before the Activity is started.
    private val pickImage = registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) avatar.setImageURI(uri)   // null = user backed out
    }

    fun onChangePhotoClicked() {
        pickImage.launch("image/*")
    }
}
```

The result comes back to the callback that asked for it, typed (a `Uri?` here). It survives recreation because Android re-connects the registration when the new Activity instance is created. That's also why you must register early. Calling `registerForActivityResult` after the Activity is `STARTED` throws an exception.

## Worked example: which kind?

| you want to… | kind | why |
| --- | --- | --- |
| open your own settings screen | explicit | you know the exact class |
| open a web page | implicit, `ACTION_VIEW` | any browser will do |
| let the user pick a photo and get it back | implicit + `registerForActivityResult(GetContent())` | you need a result |
| show up in the system Share menu | an `<intent-filter>` for `SEND` in your manifest | you're the receiver |

## Build it

Write the code, on paper or in a scratch Android project, for:

1. An explicit intent from `ListActivity` to `DetailActivity`, carrying a `String` extra named `"title"`, and the line in `DetailActivity` that reads it.
2. An intent filter that makes your Activity show up for links to `https://outth.hiyokun.dev`. Hint: `ACTION_VIEW`, the `DEFAULT` and `BROWSABLE` categories, and a `<data>` with `scheme` and `host`.
3. A `registerForActivityResult` call using `ActivityResultContracts.TakePicturePreview()`, which returns a `Bitmap?`. Handle the case where the user cancels.
