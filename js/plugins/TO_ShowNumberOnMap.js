//=============================================================================
// TO_ShowNumberOnMap.js
//=============================================================================

/*:
 * @plugindesc Show variables on the screen when on the map.
 * @author Truth Originem
 *
 * @help
 *
 * Plugin Command:
 *  ShowVariable initialize 1 0.5 0.5 100 left 意思是建立一个变量序号为1，在屏幕
 *  正中间（左上角为0,0的比例因素），最宽像素为100（ *  里面的变量最多占这么大，目前
 *  没写成比例），排列方式为左对齐的对象。该对象建立期初是不可见的，内容为变量内容。
 *  ShowVariable show 1 显示变量序号为1的对象。
 *  ShowVariable hide 1 隐藏变量序号为1的对象。
 *  ShowVariable setColor 1 #FF0000 使变量序号为1的对象呈现红色（#FF0000）
 */

var $dataVariables = null;

(function(){
    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function ()
    {
        _Scene_Map_createAllWindows.call(this);
        if(!$dataVariables){
            $dataVariables = new Window_VariableShowTab();
        }
        this.addChild($dataVariables);
    };


    function Window_VariableShowTab(){
        this.initialize.apply(this, arguments);
    }
    Window_VariableShowTab.prototype = Object.create(Window_Base.prototype);
    Window_VariableShowTab.prototype.constructor = Window_VariableShowTab;

    Window_VariableShowTab.prototype.initialize = function(){
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.opacity = 0;
        this._data = [];
    };
    Window_VariableShowTab.prototype.update = function(){
        this.contents.clear();
        for(var i =0;i<this._data.length;i++){
            var data = this._data[i];
            if(data.isEnabled()){
                this.changeTextColor(data._color);
                this.drawText(data.getVariable(),data._x,data._y,data._maxWidth,data._align);
                this.resetTextColor();
            }
        }
    };
    Window_VariableShowTab.prototype.getDatas = function(){
        return this._data;
    };
    Window_VariableShowTab.prototype.getData = function(id){
        var data = null;
        for(var i =0;i<this._data.length;i++){
            if(this._data[i]._id == id){
                data = this._data[i];
                break;
            }
        }
        return data;
    };

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ShowVariable') {
            switch (args[0]) {
                case 'initialize':
                    var data = new VariableData(Number(args[1]),Number(args[2]),Number(args[3]),Number(args[4]),String(args[5]));
                    $dataVariables.getDatas().push(data);
                    break;
                case 'show':
                    $dataVariables.getData(Number(args[1])).setEnabled(true);
                    break;
                case 'hide':
                    $dataVariables.getData(Number(args[1])).setEnabled(false);
                    break;
                case 'setColor':
                    $dataVariables.getData(Number(args[1])).setColor(String(args[2]));
                    break;
            }
        }
    };

    function VariableData(){
        this.initialize.apply(this, arguments);
    }
    VariableData.prototype.constructor = VariableData;
    VariableData.prototype.initialize = function(id,x_factor,y_factor,maxWidth,align){
        this._x = Graphics.boxWidth*x_factor;
        this._y = Graphics.boxHeight*y_factor;
        this._maxWidth = maxWidth;
        this._align = align;
        this._id = id;
        this._color = $dataVariables.normalColor();
        this._enabled = false;
    };
    VariableData.prototype.getVariable = function(){
        return $gameVariables.value(this._id);
    };
    VariableData.prototype.isEnabled = function(){
        return this._enabled;
    };
    VariableData.prototype.setEnabled = function(enabled){
        this._enabled = enabled;
    };
    VariableData.prototype.setColor = function(color){
        this._color = color;
    }
})();
