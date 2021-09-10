const conf = require("../configs/sunucuayar.json")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
    let iltifatSayi = 0;
    let iltifatlar = [
      "Yaşanılacak en güzel mevsim sensin.",
      "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
      "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
      "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
      "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
      "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
      "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
      "Müsaitsen aklım bu gece sende kalacak.",
      "Gemim olsa ne yazar liman sen olmadıktan sonra...",
      "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
      "Sabahları görmek istediğim ilk şey sensin.",
      "Mutluluk ne diye sorsalar cevabı gülüşünde ve o sıcak bakışında arardım.",
      "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
      "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
      "Sesini duymaktan hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
      "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
      "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
      "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
      "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
      "Gülüşün ne güzel öyle Cumhuriyetin gelişi gibi...",
      "Aris senden mesaj bekliyor ;)",
      "Aris selam söyledi sana.",
      "Aris buralarda olmalı çağırsana bi...",
      "Aris yanına gelmek için uçak bileti almış benden duymuş olma.",
      "Tak jileti dudağına şah damarımdan öp beni!"
    ];
    
    module.exports = async (message) => {
        if (message.channel.id === conf.chatChannel && !message.author.bot) {
        iltifatSayi++;
        if (iltifatSayi >= 25) {
          iltifatSayi = 0;
          message.lineReply(iltifatlar.random());
        };
      };
    }; 

module.exports.conf = {
  name: "message",
};
