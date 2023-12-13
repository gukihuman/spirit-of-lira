// redeclare some types for GLOBAL accessability
// nuxt issue, otherwise types auto-import doesnt work,
import {
    Graphics as tempGraphics,
    Container as tempContainer,
    Application as tempApplication,
    AnimatedSprite as tempAnimatedSprite,
    Spritesheet as tempSpritesheet,
    Texture as tempTexture,
    Rectangle as tempRectangle,
    Sprite as tempSprite,
    ISpritesheetData as tempISpriteSheetData,
} from "pixi.js"

declare global {
    // convert types back
    type Graphics = tempGraphics
    type Container = tempContainer
    type Application = tempApplication
    type AnimatedSprite = tempAnimatedSprite
    type Spritesheet = tempSpritesheet
    type Texture = tempTexture
    type Rectangle = tempRectangle
    type Sprite = tempSprite
    type ISpritesheetData = tempISpriteSheetData

    // used to turn off lagging cache
    // 📜 change name from g
    interface gSpritesheet extends Spritesheet {
        _frameKeys: any
        _frames: any
        _callback: any
        _batchIndex: any
        _processAnimations: any
        _parseComplete: any
        _nextBatch: any
        gParse: () => void
        gProcessFrames: (any) => void
    }

    type AnyObject = { [key: string]: any }
    type Entity = { [key: string]: any }
    type Token = string
}
