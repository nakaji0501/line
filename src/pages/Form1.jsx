import React, { useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import './Form1.css'; // 専用のCSSを読み込む

function Form1() {
  const [formData, setFormData] = useState({
    lineNo: '',
    kokyaku: '',
    syouhinmei: '',
    sentouin: '',
    kensain: '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '',
    endTime: '',
    yoteisuu: '',
    seisansuu: '',
    bikou: '',
  });

  const [defects, setDefects] = useState({
    douinsatu1: 0, doukizu1: 0, sokohuryou1: 0, sonota1: 0, hutahuryou: 0,
    sokomakihuryou: 0, sokokizuhekomi: 0, doukizu2: 0, douinsatu2: 0, sonota2: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDefectChange = (key, delta) => {
    setDefects(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Defect Data:", defects);
    alert("データが保存されました（コンソールに出力）");
  };

  return (
    <div className="Form1" style={{ width: '2884px', height: '940px', position: 'relative', overflow: 'hidden' }}>
      {/* 各コントロールの配置 */}

      {/* Labels */}
      <div className="Label_lineNo">ラインNO.</div>
      <div className="Label_kokyaku">顧客名</div>
      <div className="Label_sama">様</div>
      <div className="Label_syouhinmei">商品名</div>
      <div className="Label_sentouin">先頭員：</div>
      <div className="Label_kensain">検査員：</div>
      <div className="Label_katagaekan">型替え調整缶</div>
      <div className="Label_maekoutei">前工程</div>
      <div className="Label_douinsatu_1">胴印刷</div>
      <div className="Label_doukizu_1">胴キズ</div>
      <div className="Label_sokohuryou_1">底不良</div>
      <div className="Label_sonota_1">その他</div>
      <div className="Label_hutahuryou">蓋不良</div>
      <div className="Label_startTime">生産開始時間</div>
      <div className="Label_endTime">生産終了時間</div>
      <div className="Label_kensahuryou">検査不良(胴＋底)</div>
      <div className="Label_bikou">コメント</div>
      <div className="Label_yoteisuu">予定数</div>
      <div className="Label_seisansuu">生産数</div>

      {/* Input Fields (RichTextBox, ComboBox, DateTimePicker) */}
      <Form.Control as="select" className="ComboBox_lineNo" name="lineNo" value={formData.lineNo} onChange={handleChange}>
        <option value="">選択</option>
        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
        <option value="E">E</option><option value="F">F</option><option value="G">G</option><option value="H">H</option>
        <option value="I">I</option><option value="J">J</option><option value="K">K</option><option value="L">L</option>
      </Form.Control>
      <Form.Control as="input" className="RichTextBox_kokyaku" name="kokyaku" value={formData.kokyaku} onChange={handleChange} />
      <Form.Control as="input" className="RichTextBox_syouhinmei" name="syouhinmei" value={formData.syouhinmei} onChange={handleChange} />
      <Form.Control as="select" className="ComboBox_sentouin" name="sentouin" value={formData.sentouin} onChange={handleChange}>
        <option value="">選択</option>
        <option value="加藤浩">加藤浩</option><option value="永吉則久">永吉則久</option><option value="藤田蓮">藤田蓮</option><option value="中島拓海">中島拓海</option>
        <option value="林洋子">林洋子</option><option value="相浦絵美子">相浦絵美子</option><option value="石川美穂">石川美穂</option><option value="渡部加奈子">渡部加奈子</option>
        <option value="中島里美">中島里美</option><option value="重水明日香">重水明日香</option><option value="伊藤枝里子">伊藤枝里子</option><option value="その他">その他</option>
      </Form.Control>
      <Form.Control as="select" className="ComboBox_kensain" name="kensain" value={formData.kensain} onChange={handleChange}>
        <option value="">選択</option>
        <option value="林洋子">林洋子</option><option value="相浦絵美子">相浦絵美子</option><option value="石川美穂">石川美穂</option><option value="渡部加奈子">渡部加奈子</option>
        <option value="中島里美">中島里美</option><option value="重水明日香">重水明日香</option><option value="伊藤枝里子">伊藤枝里子</option><option value="その他">その他</option>
      </Form.Control>
      <Form.Control type="date" className="Input_date" name="date" value={formData.date} onChange={handleChange} />
      <Form.Control type="time" className="dtp_start1" name="startTime" value={formData.startTime} onChange={handleChange} />
      <Form.Control type="time" className="dtp_end1" name="endTime" value={formData.endTime} onChange={handleChange} />
      <Form.Control as="textarea" className="RichTextBox_bikou" name="bikou" value={formData.bikou} onChange={handleChange} />
      <Form.Control type="number" className="RichTextBox_yoteisuu" name="yoteisuu" value={formData.yoteisuu} onChange={handleChange} />
      <Form.Control type="number" className="RichTextBox_seisansuu" name="seisansuu" value={formData.seisansuu} onChange={handleChange} />

      {/* Defect Counters (Panels with Buttons and Labels) */}
      <div className="Panel_douinsatu2">
        <div className="Label_douinsatu_2">印刷不良</div>
        <div className="Label_douinsatu2_sum">{defects.douinsatu2}</div>
        <Button className="Button_douinsatu2_plus" onClick={() => handleDefectChange('douinsatu2', 1)}>+</Button>
        <Button className="Button_douinsatu2_minus" onClick={() => handleDefectChange('douinsatu2', -1)}>-</Button>
      </div>
      <div className="Panel_doukizu2">
        <div className="Label_doukizu_2">胴キズ</div>
        <div className="Label_doukizu2_sum">{defects.doukizu2}</div>
        <Button className="Button_doukizu2_plus" onClick={() => handleDefectChange('doukizu2', 1)}>+</Button>
        <Button className="Button_doukizu2_minus" onClick={() => handleDefectChange('doukizu2', -1)}>-</Button>
      </div>
      <div className="Panel_sokokizuhekomi">
        <div className="Label_sokoryou_2">底キズ・凹</div>
        <div className="Label_sokokizuhekomi_sum">{defects.sokokizuhekomi}</div>
        <Button className="Button_sokokizuhekomi_plus" onClick={() => handleDefectChange('sokokizuhekomi', 1)}>+</Button>
        <Button className="Button_sokokizuhekomi_minus" onClick={() => handleDefectChange('sokokizuhekomi', -1)}>-</Button>
      </div>
      <div className="Panel_sokomakihuryou">
        <div className="Label_sokomakihuryou">底巻き不良</div>
        <div className="Label_sokomakihuryou_sum">{defects.sokomakihuryou}</div>
        <Button className="Button_sokomakihuryou_plus" onClick={() => handleDefectChange('sokomakihuryou', 1)}>+</Button>
        <Button className="Button_sokomakihuryou_minus" onClick={() => handleDefectChange('sokomakihuryou', -1)}>-</Button>
      </div>
      <div className="Panel_sonota2">
        <div className="Label_sonota_2">その他</div>
        <div className="Label_sonota2_sum">{defects.sonota2}</div>
        <Button className="Button_sonota2_plus" onClick={() => handleDefectChange('sonota2', 1)}>+</Button>
        <Button className="Button_sonota2_minus" onClick={() => handleDefectChange('sonota2', -1)}>-</Button>
      </div>

      {/* 前工程不良 */}
      <div className="Label_douinsatu1_sum">{defects.douinsatu1}</div>
      <Button className="Button_douinsatu1_plus" onClick={() => handleDefectChange('douinsatu1', 1)}>+</Button>
      <Button className="Button_douinsatu1_minus" onClick={() => handleDefectChange('douinsatu1', -1)}>-</Button>

      <div className="Label_doukizu1_sum">{defects.doukizu1}</div>
      <Button className="Button_doukizu1_plus" onClick={() => handleDefectChange('doukizu1', 1)}>+</Button>
      <Button className="Button_doukizu1_minus" onClick={() => handleDefectChange('doukizu1', -1)}>-</Button>

      <div className="Label_sokohuryou1_sum">{defects.sokohuryou1}</div>
      <Button className="Button_sokohuryou1_plus" onClick={() => handleDefectChange('sokohuryou1', 1)}>+</Button>
      <Button className="Button_sokohuryou1_minus" onClick={() => handleDefectChange('sokohuryou1', -1)}>-</Button>

      <div className="Label_sonota1_sum">{defects.sonota1}</div>
      <Button className="Button_sonota1_plus" onClick={() => handleDefectChange('sonota1', 1)}>+</Button>
      <Button className="Button_sonota1_minus" onClick={() => handleDefectChange('sonota1', -1)}>-</Button>

      <div className="Label_hutahuryou_sum">{defects.hutahuryou}</div>
      <Button className="Button_hutahuryou_plus" onClick={() => handleDefectChange('hutahuryou', 1)}>+</Button>
      <Button className="Button_hutahuryou_minus" onClick={() => handleDefectChange('hutahuryou', -1)}>-</Button>

      {/* Buttons */}
      <Button className="btn_updateView" onClick={handleSubmit}>保存</Button>
      <Button className="Button_NyuuryokuReset">リセット</Button>
      <Button className="btn_moveToTop">Topへ</Button>
      <Button className="Button_search_siyousyo">仕様書検索</Button>
      <Button className="Btn_Time_Start">START</Button>
      <Button className="Btn_Time_End">END</Button>

      {/* Image */}
      <Image src="/sobajima.png" className="pb_sobajima" /> {/* 画像はpublicフォルダに配置を想定 */}

      {/* CheckBox */}
      <Form.Check type="checkbox" label="蓋はめ無しはチェック" className="CheckBox_hutahame_check" />

      {/* その他のLabel (現状は表示のみ) */}
      <div className="Label_seisansuu_kan">缶</div>
      <div className="Label_touzitusiyousuu_comment">（生産数+不良数）</div>
      <div className="Label_Trouble">トラブル回数：</div>
      <div className="Label_Trouble_Count">0</div>
      <div className="Label1">R70501</div>

    </div>
  );
}

export default Form1;
