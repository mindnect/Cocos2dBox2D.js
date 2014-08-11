var PTM_RATIO = 32;


var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    world:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function(touches, event){
                //Add a new body/atlas sprite at the touched location
                var touch = touches[0];
                var location = touch.getLocation();
                event.getCurrentTarget().addNewSpriteWithCoords(location);
            }
        }), this);


        var screenSize = cc.director.getWinSize();

        this.world = new b2World(new b2Vec2(0, -10));
        this.world.SetContinuousPhysics(true);

        //Debug Draw
        if(!cc.sys.isNative){
            var drawNode = new DebugBox2DNode(this.world);
           this.addChild(drawNode);
        }

        // 깔때기
        var vertices = [new b2Vec2(-2,-1),new b2Vec2(2,0.2),new b2Vec2(2,0.8), new b2Vec2(-2,2)];
        this.addNewSpriteWithCoords(cc.p(screenSize.width/2,screenSize.height/2));
        this.scheduleUpdate();
        return true;
    },

    draw:function(ctx){
        this._super();
    },

    addNewSpriteWithCoords:function (pos) {
        var spr = cc.Sprite.create(res.CloseSelected_png);
        spr.setPosition(pos);
        this.addChild(spr,1);

        // create body
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position = new b2Vec2(pos.x/PTM_RATIO, pos.y/PTM_RATIO);

        var body = this.world.CreateBody(bodyDef);
        body.SetUserData(spr);

        // create shape
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(1.0, 1.0);

        // create fixture
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.3;

        body.CreateFixture(fixtureDef);
    },
    update:function(dt){
        var velocityIterations = 8;
        var positionIterations = 1;
        this.world.Step(dt, velocityIterations, positionIterations);

        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData()) {
                var sprite = b.GetUserData();
                sprite.setPosition(cc.p(b.GetPosition().x*PTM_RATIO, b.GetPosition().y*PTM_RATIO));
                sprite.setRotation(-1*cc.radiansToDegrees(b.GetAngle()));
            }
        }
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

