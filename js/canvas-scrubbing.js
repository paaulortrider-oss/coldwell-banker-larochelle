'use strict';

const frameUrls = [
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903842/frame_0001_cna31z.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903847/frame_0002_ox0lch.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903844/frame_0003_b2nvgt.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903854/frame_0004_kscnza.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903851/frame_0005_dulztk.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903846/frame_0006_cn8xmc.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903850/frame_0007_kqyvxb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903899/frame_0008_xyg9cg.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903895/frame_0009_iifwj7.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903856/frame_0010_fhlkwj.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903851/frame_0011_f9v8u0.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903854/frame_0012_y00zcc.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903856/frame_0013_qmdjny.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903856/frame_0014_lyshon.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903858/frame_0015_n40f1a.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903861/frame_0016_fdfmye.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903863/frame_0017_unofg0.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903864/frame_0018_cqq8t4.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903912/frame_0019_sf0qjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903912/frame_0020_q4v16a.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903913/frame_0021_u9tkyg.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903913/frame_0022_b9u4c7.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903914/frame_0023_v6xshn.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903914/frame_0024_d68rba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903912/frame_0025_sd1dt0.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903841/frame_0026_qgqj7n.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903841/frame_0027_esw1u7.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903840/frame_0028_d6fdmf.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903841/frame_0029_on5uof.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903842/frame_0030_vscsly.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903912/frame_0031_rbfshb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903913/frame_0032_k1iwtv.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903914/frame_0033_iaymsb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903914/frame_0034_o4vshv.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903914/frame_0035_o04onr.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903915/frame_0036_lghvba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903915/frame_0037_syg4is.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903915/frame_0038_pcoocu.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903917/frame_0039_ymvcck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903917/frame_0040_q3h708.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903920/frame_0041_shskov.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903919/frame_0042_caxffo.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903920/frame_0043_sz7cuz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903920/frame_0044_atg3gq.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903921/frame_0045_esct3w.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903921/frame_0046_ymdf5i.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903923/frame_0047_t1nww6.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903923/frame_0048_a2qf5g.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903924/frame_0049_fmdqba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903924/frame_0050_mks8w1.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903926/frame_0051_f7q05o.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903926/frame_0052_hizmj7.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903927/frame_0053_itpxgq.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903927/frame_0054_ndp1ha.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903929/frame_0055_d7pffb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903929/frame_0056_wco0uz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903930/frame_0057_kax9gq.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903930/frame_0058_r2atsh.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903932/frame_0059_i7wexq.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903932/frame_0060_or67hn.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903933/frame_0061_r170or.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903933/frame_0062_d3ofsh.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903935/frame_0063_g6w3of.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903935/frame_0064_or0scz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903936/frame_0065_nfdwhz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903936/frame_0066_v3bshm.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903938/frame_0067_k6wfsh.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903938/frame_0068_e6ofgz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903940/frame_0069_mww9iz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903939/frame_0070_lphwnz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903941/frame_0071_rtofjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903941/frame_0072_pqq8v1.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903943/frame_0073_wawhzf.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903943/frame_0074_gzhovx.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903945/frame_0075_c8fofg.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903945/frame_0076_g6szka.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903947/frame_0077_un8ofz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903947/frame_0078_r0pslz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903949/frame_0079_on8fjg.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903949/frame_0080_yqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903951/frame_0081_y1shka.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903951/frame_0082_e3pfgo.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903953/frame_0083_v1s7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903953/frame_0084_u0p9co.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903955/frame_0085_v3shka.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903955/frame_0086_mepskz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903957/frame_0087_onwfhn.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903957/frame_0088_xphwjc.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903959/frame_0089_onwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903959/frame_0090_qzhxka.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903961/frame_0091_nawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903961/frame_0092_wqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903963/frame_0093_ynwfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903963/frame_0094_pqp9hz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903965/frame_0095_onwfha.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903965/frame_0096_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903967/frame_0097_onwfjy.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903967/frame_0098_qhhkzg.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903969/frame_0099_unfhma.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903969/frame_0100_wqqhnz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903971/frame_0101_ynwjla.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903971/frame_0102_yqonxz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903973/frame_0103_onvfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903973/frame_0104_u9phjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903975/frame_0105_uawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903975/frame_0106_wqojha.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903977/frame_0107_onwjla.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903977/frame_0108_yqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903979/frame_0109_unwfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903979/frame_0110_mep7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903981/frame_0111_onwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903981/frame_0112_u9pjha.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903983/frame_0113_onwfhy.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903983/frame_0114_mep7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903985/frame_0115_oawfhy.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903985/frame_0116_vhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903987/frame_0117_onwfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903987/frame_0118_qph7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903989/frame_0119_onwfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903989/frame_0120_whp7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903991/frame_0121_onwfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903991/frame_0122_xphjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903993/frame_0123_uawfhy.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903993/frame_0124_yph7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903995/frame_0125_onwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903995/frame_0126_qhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903997/frame_0127_onwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903997/frame_0128_vqp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903999/frame_0129_oawfhz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903999/frame_0130_vqp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904001/frame_0131_uawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904001/frame_0132_xqp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904003/frame_0133_oawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904003/frame_0134_xqp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904005/frame_0135_oawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904005/frame_0136_vqp7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904007/frame_0137_oawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904007/frame_0138_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904009/frame_0139_oawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904009/frame_0140_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904011/frame_0141_oawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904011/frame_0142_xhp7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904013/frame_0143_oawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904013/frame_0144_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904015/frame_0145_oawfjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904015/frame_0146_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904017/frame_0147_oawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904017/frame_0148_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904019/frame_0149_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904019/frame_0150_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904021/frame_0151_oawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904021/frame_0152_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904023/frame_0153_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904023/frame_0154_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904025/frame_0155_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904025/frame_0156_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904027/frame_0157_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904027/frame_0158_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904029/frame_0159_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904029/frame_0160_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904031/frame_0161_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904031/frame_0162_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904033/frame_0163_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904033/frame_0164_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904035/frame_0165_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904035/frame_0166_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904037/frame_0167_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904037/frame_0168_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904039/frame_0169_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904039/frame_0170_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904041/frame_0171_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904041/frame_0172_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904043/frame_0173_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904043/frame_0174_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904045/frame_0175_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904045/frame_0176_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904047/frame_0177_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904047/frame_0178_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904049/frame_0179_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904049/frame_0180_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904051/frame_0181_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904051/frame_0182_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904053/frame_0183_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904053/frame_0184_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904055/frame_0185_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904055/frame_0186_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904057/frame_0187_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904057/frame_0188_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904059/frame_0189_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904059/frame_0190_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904061/frame_0191_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904061/frame_0192_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904063/frame_0193_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904063/frame_0194_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904065/frame_0195_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904065/frame_0196_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904067/frame_0197_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904067/frame_0198_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904069/frame_0199_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904069/frame_0200_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904071/frame_0201_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904071/frame_0202_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904073/frame_0203_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904073/frame_0204_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904075/frame_0205_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904075/frame_0206_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904077/frame_0207_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904077/frame_0208_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904079/frame_0209_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904079/frame_0210_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904081/frame_0211_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904081/frame_0212_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904083/frame_0213_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904083/frame_0214_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904085/frame_0215_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904085/frame_0216_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904087/frame_0217_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904087/frame_0218_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904089/frame_0219_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904089/frame_0220_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904091/frame_0221_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904091/frame_0222_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904093/frame_0223_unwhna.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904093/frame_0224_vqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904095/frame_0225_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904095/frame_0226_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904097/frame_0227_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904097/frame_0228_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904099/frame_0229_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904099/frame_0230_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904101/frame_0231_uawfkz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779904101/frame_0232_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903912/frame_0233_gx37lr.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903913/frame_0234_h6g7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903913/frame_0235_mew7cm.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903914/frame_0236_vewhjz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903915/frame_0237_nawhnc.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903915/frame_0238_yepscz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903916/frame_0239_vph7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903916/frame_0240_vph7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903917/frame_0241_yhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903918/frame_0242_xhpsba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903918/frame_0243_whpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903919/frame_0244_whp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903920/frame_0245_yhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903921/frame_0246_xhp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903921/frame_0247_xph7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903922/frame_0248_wqp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903922/frame_0249_xhp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903923/frame_0250_whp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903924/frame_0251_yhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903925/frame_0252_xhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903926/frame_0253_wqp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903926/frame_0254_xhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903927/frame_0255_yhp7ck.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903928/frame_0256_whp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903928/frame_0257_xhpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903929/frame_0258_whpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903930/frame_0259_whpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903930/frame_0260_xhp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903931/frame_0261_whpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903932/frame_0262_whp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903933/frame_0263_whpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903934/frame_0264_xhpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903934/frame_0265_whpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903935/frame_0266_yhp7cz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903935/frame_0267_xhpjbz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903936/frame_0268_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903937/frame_0269_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903937/frame_0270_xhp7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903938/frame_0271_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903939/frame_0272_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903940/frame_0273_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903941/frame_0274_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903941/frame_0275_whp7ca.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903942/frame_0276_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903943/frame_0277_wqpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903944/frame_0278_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903944/frame_0279_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903945/frame_0280_xhpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903946/frame_0281_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903946/frame_0282_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903947/frame_0283_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903948/frame_0284_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903949/frame_0285_whpjba.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903884/frame_0286_xqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903884/frame_0287_wqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0288_yqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0289_xqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903884/frame_0290_xqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0291_wqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0292_yqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0293_wqqonb.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0294_w901vi.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903883/frame_0295_j2worz.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903876/frame_0296_ihpvuq.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903875/frame_0297_qsmjth.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903865/frame_0298_jd20hf.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903868/frame_0299_cai7nx.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903857/frame_0300_n73pz1.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903856/frame_0301_keyr3n.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903862/frame_0302_bq0vdi.jpg',
  'https://res.cloudinary.com/dhfcdtyxs/image/upload/v1779903862/frame_0303_mtuajc.jpg',
];

const TOTAL_FRAMES = frameUrls.length;
const scrubFrames = new Array(TOTAL_FRAMES);

function preloadScrubFrames(onProgress) {
    let loaded = 0;
    const promises = frameUrls.map((url, index) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                scrubFrames[index] = img;
                loaded++;
                if (onProgress) onProgress(loaded, TOTAL_FRAMES);
                resolve();
            };
            img.onerror = () => {
                loaded++;
                if (onProgress) onProgress(loaded, TOTAL_FRAMES);
                resolve();
            };
            img.src = url;
        });
    });

    const batched = [];
    const BATCH = 20;
    for (let i = 0; i < promises.length; i += BATCH) {
        const batch = promises.slice(i, i + BATCH);
        if (batched.length === 0) {
            batched.push(Promise.all(batch));
        } else {
            batched.push(batched[batched.length - 1].then(() => Promise.all(batch)));
        }
    }

    return Promise.all(promises);
}

function initCanvasScrubbing() {
    const canvas = document.getElementById('canvas-scrubbing');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentFrame = 0;

    function resizeCanvas() {
        const container = canvas.parentElement;
        if (!container) return;

        const maxW = Math.min(container.clientWidth * 0.85, 1920);
        const maxH = container.clientHeight * 0.85;
        const aspect = 16 / 9;

        let w = maxW;
        let h = w / aspect;
        if (h > maxH) { h = maxH; w = h * aspect; }

        canvas.width = Math.round(w);
        canvas.height = Math.round(h);
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';

        drawFrame(currentFrame);
    }

    function drawFrame(index) {
        const img = scrubFrames[index];
        if (!img) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = cw / ch;

        let sx, sy, sw, sh;
        if (imgAspect > canvasAspect) {
            sh = img.naturalHeight;
            sw = sh * canvasAspect;
            sx = (img.naturalWidth - sw) / 2;
            sy = 0;
        } else {
            sw = img.naturalWidth;
            sh = sw / canvasAspect;
            sx = 0;
            sy = (img.naturalHeight - sh) / 2;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    if (window.innerWidth < 768) {
        resizeCanvas();
        let mobileFrame = 0;
        setInterval(() => {
            mobileFrame = (mobileFrame + 1) % TOTAL_FRAMES;
            if (scrubFrames[mobileFrame]) {
                currentFrame = mobileFrame;
                drawFrame(currentFrame);
            }
        }, 42);
        return;
    }

    const scrubObj = { frame: 0 };

    gsap.to(scrubObj, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
            trigger: '#section-scrubbing',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            onUpdate: (self) => {
                const target = Math.round(scrubObj.frame);
                if (target !== currentFrame && scrubFrames[target]) {
                    currentFrame = target;
                    drawFrame(currentFrame);
                }
                if (typeof updateScrubTexts === 'function') {
                    updateScrubTexts(self.progress);
                }
            }
        }
    });

    resizeCanvas();
    drawFrame(0);
    window.addEventListener('resize', resizeCanvas);
}

window.preloadScrubFrames = preloadScrubFrames;
window.initCanvasScrubbing = initCanvasScrubbing;
