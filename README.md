# Grandpa Tihon

> A bot that sends incomprehensible crap into a conversation, and even randomly. From the village, what to say.

##### _- [Vatslav Tarnatovski](https://vk.com/tarnatovski)_

## Usage

To add bot, go to [VK userpage](https://vk.com/tihon_bot) and add **bot to friends list**.
Then, you can actually start using bot by typing commands, starting with `/` or `@tihon_bot`.

## Commands

See [bot's website](https://dedtihon.cf/commands)

## Running

```
git clone https://github.com/jarvis394/tihon
cd tihon
npm install
```

**IMPORTANT!** After these steps you must provide **USER**'s VK API token and other enviroment constants in `.env`. Then just type

```
npm start
```

to run bot by yourself.

## Todo

Global:

- ~~Learn TypeScript to get rid of some checking~~
- ~~Make an API~~
- Translate everything to English, even `/random`

Needed:
- ~~Add unified timeouts for commands~~
- Get results of every command written with command log
- Log data changes for debugging
- Recursively check commands filetree to get **`parents`** and **`children`** of commands.
  For example,

  ```javascript
  // Parent
  - guild/

    // Children
    - create { aliases: [ ...] }
    - leave { aliases: [ ... ] }
    ...
  ```
  
## Credits

My VK: [@tarnatovski](https://vk.com/tarnatovski)
