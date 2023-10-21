// キー入力サンプル
// X(旧:Twitter)
// https://twitter.com/akashic_talk/status/1246000878672207872
/*
ニコ生自作ゲーム窓口@akashic_talk
	作者の方から回答いただけていますが、
	こちらのゲームはwindow.addEventListener("keydown", ...) など
	ブラウザのキーボード関係の機能を直接使っているものかと思います。
	これは RPG アツマールで動作させる場合は問題ないのですが、
	ニコニコ生放送上では動作しないケースがあり、作者の方から回答いただけていますが、こちらのゲームはwindow.addEventListener("keydown", ...) などブラウザのキーボード関係の機能を直接使っているものかと思います。
	これは RPG アツマールで動作させる場合は問題ないのですが、ニコニコ生放送上では動作しないケースがあり、→続きます
	Akashic Engine としては推奨していません。
	(特に "multi" タイプのゲームでは動作しません (サーバサイド(ブラウザ以外の環境)でも実行するため)。
	実は現状、 "ranking" タイプのゲーム (このゲームもそうです) であればブラウザ専用の機能も使えてしまうのですが、
	保証外とさせていただいています)
*/
// とのことなので仕様が変わったり、環境で動かなくなっても泣かないこと。

// アカシックラベルの利用
// akashic install @akashic-extension/akashic-label
import { Label } from "@akashic-extension/akashic-label";
import { GameMainParameterObject } from "./parameterObject";

// どこかからか取ってきたwindowインターフェース これでDOM操作もできる？
declare const window: any;

export function main(param: GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: []
	});
	// 制限時間
	let time = 30;
	// if (param.sessionParameter.totalTimeLimit) {
	// 	time = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用します
	// }
	// =============================================================
	// シーン読込時処理
	// =============================================================
	scene.onLoad.add(() => {
		// 白背景
		const rect: g.FilledRect = new g.FilledRect({
			scene: scene,
			cssColor: "white",
			width: g.game.width,
			height: g.game.height,
		});
		scene.append(rect);

		// フォントの生成
		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: "sans-serif",
			size: 48
		});

		// キー入力表示用ラベル
		const label = new Label({
			scene: scene,
			font: font,
			text: "",
			width: g.game.width,
			height: g.game.height,
		});
		scene.append(label);

		// マウス座標表示用
		const label2 = new Label({
			scene: scene,
			font: font,
			text: "a",
			width: g.game.width,
			height: 200,
			x: 0,
			y: g.game.height - 200,
		});
		scene.append(label2);

		// 残り時間表示用ラベル
		const timeLabel = new g.Label({
			scene: scene,
			text: "TIME: 0",
			font: font,
			fontSize: font.size / 2,
			textColor: "black",
			x: 0.65 * g.game.width
		});
		scene.append(timeLabel);

		// =============================================================
		// キー押下時処理
		// =============================================================
		let keydownNum: number = 0;
		window.addEventListener("keydown", (ev: any) => {
			// 入力表示(8回入力されたら改行)
			label.text += `${ev.keyCode}:'${String.fromCharCode(ev.keyCode)}',`;
			keydownNum++;
			if (keydownNum % 8 === 0) {
				label.text += "\r";
			}
			label.invalidate();
		});

		// =============================================================
		// マウス移動時処理 touchmove も必要？
		// =============================================================
		// https://www.ipentec.com/document/html-canvas-get-pointer-position
		window.addEventListener("mousemove", (ev: any) => {
			label2.text = `offset(x,y)=(${ev.offsetX},${ev.offsetY})`;
			label2.invalidate();
		});
		// https://dianxnao.com/javascript：スマホでタッチした座標を取得する/#toc9
		window.addEventListener("touchmove", (ev: any) => {
			const touches = ev.changedTouches;
			// const offset = this.getBoundingClientRect();
			if (touches) {
				// clientとpageがそれっぽいので
				label2.text = `screen(x,y)=(${touches[0].screenX},${touches[0].screenY})\r`;
				label2.text += `client(x,y)=(${touches[0].clientX},${touches[0].clientY})\r`;
				label2.text += `page(x,y)=(${touches[0].pageX},${touches[0].pageY})\r`;
				label2.invalidate();
			}
		});
		// =============================================================
		// シーン更新時処理
		// =============================================================
		const updateHandler = (): void => {
			if (time <= 0) {
				scene.onUpdate.remove(updateHandler); // カウントダウンを止めるためにこのイベントハンドラを削除します
			}
			// カウントダウン処理
			time -= 1 / g.game.fps;
			timeLabel.text = "TIME: " + Math.ceil(time);
			timeLabel.invalidate();
		};
		scene.onUpdate.add(updateHandler);
	});
	g.game.pushScene(scene);
}
