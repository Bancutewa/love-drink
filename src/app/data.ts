export interface Card {
  id: string;
  text: string;
  type?: "drink_if" | "most_likely" | "confession" | "dare";
  level?: "connection" | "intimacy" | "tease" | "passion";
  heart_reward?: number;
  desire_reward?: number;
}

export interface GameData {
  game_info: {
    name: string;
    version: string;
    created_for: string;
  };
  decks: {
    drink: {
      drink_if: Card[];
      most_likely: Card[];
      confession: Card[];
      dare: Card[];
    };
    love: {
      connection: Card[];
      intimacy: Card[];
      tease: Card[];
      passion: Card[];
    };
  };
}

export const gameData: GameData = {
  game_info: {
    name: "Love & Drink - Private Edition",
    version: "2.1",
    created_for: "You & Your Partner"
  },
  decks: {
    drink: {
      drink_if: [
        {
          id: "DI001",
          text: "Uống 1 ngụm nếu {player} cảm thấy mình yêu {partner} nhiều hơn (nếu cả hai cùng nhận thì cùng cạn ly nhé)."
        },
        {
          id: "DI002",
          text: "Uống 1 ngụm nếu {player} từng lén nhìn {partner} lúc đang ngủ rồi mỉm cười hạnh phúc."
        },
        {
          id: "DI003",
          text: "Uống 1 ngụm nếu {player} từng ghen tuông vu vơ nhưng lại cố giấu không cho {partner} biết."
        },
        {
          id: "DI004",
          text: "Uống 1 ngụm nếu {player} từng mơ về một đám cưới lãng mạn hay ngôi nhà chung của hai đứa."
        },
        {
          id: "DI005",
          text: "Uống 1 ngụm nếu {player} có lưu ảnh dìm của {partner} để thỉnh thoảng mang ra trêu."
        },
        {
          id: "DI006",
          text: "Uống 2 ngụm nếu {player} thấy {partner} quyến rũ và gợi cảm nhất là lúc vừa tắm xong."
        },
        {
          id: "DI007",
          text: "Uống 1 ngụm nếu {player} là người đã chủ động nhắn tin hoặc bật đèn xanh trước trong mối quan hệ này."
        },
        {
          id: "DI008",
          text: "Uống 1 ngụm nếu {player} từng cố tình mặc đồ lót sexy/áo mỏng chỉ để thu hút sự chú ý của {partner}."
        },
        {
          id: "DI009",
          text: "Uống 1 ngụm nếu {player} từng có ý nghĩ 'đen tối' với {partner} ngay tại một nơi công cộng đông người."
        },
        {
          id: "DI010",
          text: "Uống 1 ngụm nếu {player} từng lén lút ghen tị với người yêu cũ của {partner}."
        }
      ],
      most_likely: [
        {
          id: "ML001",
          text: "Cùng đếm 1-2-3 và chỉ tay vào người hay dỗi hờn vu vơ hơn. Ai bị chỉ phải uống 1 ngụm!"
        },
        {
          id: "ML002",
          text: "Cùng đếm 1-2-3 và chỉ vào người hay chủ động ôm hôn hơn mỗi ngày. Người đó xứng đáng được uống 1 ngụm!"
        },
        {
          id: "ML003",
          text: "Cùng đếm 1-2-3 và chỉ vào người có nhiều suy nghĩ 'hư hỏng' hơn khi hai đứa ở cạnh nhau. Ai bị chỉ uống 2 ngụm!"
        },
        {
          id: "ML004",
          text: "Cùng đếm 1-2-3 và chỉ vào người chiều chuộng nửa kia hơn. Người đó tự thưởng 1 ngụm nhé!"
        },
        {
          id: "ML005",
          text: "Cùng đếm 1-2-3 và chỉ vào người có nhiều khả năng sẽ 'bật đèn xanh' lôi kéo người kia lên giường đêm nay nhất."
        },
        {
          id: "ML006",
          text: "Cùng đếm 1-2-3 và chỉ vào người có nhiều tưởng tượng táo bạo nhất trong chuyện ấy."
        },
        {
          id: "ML007",
          text: "Cùng đếm 1-2-3 và chỉ vào người có khả năng đang giấu một 'kỹ năng' giường chiếu chưa từng phô diễn."
        }
      ],
      confession: [
        {
          id: "CF001",
          text: "{player} hãy kể lại một suy nghĩ đen tối nhất về {partner} khi hai đứa đang ở nơi đông người. Thú nhận đi, hoặc uống 2 ngụm!"
        },
        {
          id: "CF002",
          text: "Điểm nào trên cơ thể {partner} khiến {player} dễ bị kích thích và muốn chạm vào nhất? Khai thật hoặc phạt 1 ngụm."
        },
        {
          id: "CF003",
          text: "Kể tên một hành động của {partner} khi hai đứa ân ái khiến {player} đê mê và nhớ mãi. Không nói thì phạt 2 ngụm."
        },
        {
          id: "CF004",
          text: "{player} muốn {partner} mặc trang phục gì, hoặc đóng vai gì (roleplay) trong lần ân ái tới? Trả lời hoặc uống nhé."
        },
        {
          id: "CF005",
          text: "Có điều gì thầm kín {player} rất muốn thử cùng {partner} nhưng trước giờ chưa dám mở lời? Thổ lộ ngay hoặc phạt uống."
        },
        {
          id: "CF006",
          text: "{player} hãy khai thật, tư thế làm tình nào khiến {player} đê mê và dễ lên đỉnh nhất? Khai hoặc uống 2 ngụm!"
        },
        {
          id: "CF007",
          text: "{player} từng trải qua một giấc mơ ướt át nào có mặt {partner} chưa? Kể tóm tắt chi tiết hoặc uống!"
        },
        {
          id: "CF008",
          text: "Nơi nào mạo hiểm hoặc kỳ lạ nhất mà {player} từng nghĩ đến việc làm 'chuyện ấy' với {partner}? Nói đi đừng ngại!"
        },
        {
          id: "CF009",
          text: "Có món đồ/quần áo cụ thể nào của {partner} khiến {player} không thể rời mắt và chỉ muốn cởi nó ra ngay lập tức?"
        }
      ],
      dare: [
        {
          id: "DR001",
          text: "{player} hãy ghé sát tai {partner} và thì thầm một điều táo bạo muốn làm đêm nay, hoặc uống 2 ngụm."
        },
        {
          id: "DR002",
          text: "{player} hãy ôm {partner} từ phía sau và hôn nhẹ lên cổ trong 15 giây, hoặc tự phạt 1 ngụm."
        },
        {
          id: "DR003",
          text: "{player} hãy dùng môi lướt nhẹ dọc theo xương quai xanh của {partner}, hoặc uống 2 ngụm."
        },
        {
          id: "DR004",
          text: "{player} nhắm mắt lại, để {partner} dùng ngón tay mơn trớn đôi môi trong 30 giây. Nếu {player} mỉm cười sẽ phải uống!"
        },
        {
          id: "DR005",
          text: "{player} hãy cởi một món đồ bất kỳ đang mặc trên người (trừ trang sức) hoặc tự phạt uống 2 ngụm lớn!"
        },
        {
          id: "DR006",
          text: "{player} hãy yêu cầu {partner} nhắm mắt lại, rồi dùng một viên đá lạnh (hoặc ngón tay) trượt nhẹ từ cổ xuống ngực {partner}."
        },
        {
          id: "DR007",
          text: "{player} hãy nhảy một điệu sexy, gợi cảm ngắn cho {partner} xem trong vòng 30 giây, hoặc tự phạt uống 2 ngụm."
        },
        {
          id: "DR008",
          text: "{player} hãy thử đút cho {partner} một món đồ ăn nhẹ (hoặc uống ngụm rượu) bằng miệng (Mouth-to-mouth), hoặc uống."
        }
      ]
    },
    love: {
      connection: [
        {
          id: "LC001",
          text: "{player} hãy nhớ lại, khoảnh khắc chính xác nào khiến {player} nhận ra mình đã yêu {partner} sâu đậm?",
          heart_reward: 2
        },
        {
          id: "LC002",
          text: "Nếu được quay lại ngày đầu tiên hẹn hò, {player} muốn làm thêm điều gì để ngày hôm đó hoàn hảo hơn nữa?",
          heart_reward: 2
        },
        {
          id: "LC003",
          text: "Cử chỉ chăm sóc nhỏ bé nào của {partner} khiến {player} cảm thấy được trân trọng và an toàn nhất?",
          heart_reward: 2
        },
        {
          id: "LC004",
          text: "Điều gì ở {partner} khiến {player} luôn có niềm tin mãnh liệt vào tương lai của hai đứa?",
          heart_reward: 2
        },
        {
          id: "LC005",
          text: "Nếu phải chọn một bài hát diễn tả đúng nhất tình yêu {player} dành cho {partner}, đó sẽ là bài gì?",
          heart_reward: 3
        },
        {
          id: "LC006",
          text: "Theo {player}, điểm yếu/thói quen đáng yêu nhất của {partner} mà hiếm ai biết ngoài {player} là gì?",
          heart_reward: 2
        },
        {
          id: "LC007",
          text: "Nếu chỉ còn đúng một ngày để ở bên nhau trọn vẹn, {player} muốn hai đứa sẽ trải qua nó như thế nào?",
          heart_reward: 3
        },
        {
          id: "LC008",
          text: "Ký ức nào về nụ hôn đầu tiên (hoặc lần nắm tay đầu) của hai đứa khiến {player} vẫn rung động mỗi khi nhớ lại?",
          heart_reward: 2
        }
      ],
      intimacy: [
        {
          id: "LI001",
          text: "{player} và {partner} hãy đặt tay lên ngực trái của nhau, nhìn sâu vào mắt nhau trong 45 giây và không nói một lời nào.",
          heart_reward: 3,
          desire_reward: 1
        },
        {
          id: "LI002",
          text: "{player} nhắm mắt lại, để {partner} đặt 3 nụ hôn thật chậm lên 3 vị trí bất kỳ trên khuôn mặt (trừ môi).",
          heart_reward: 2,
          desire_reward: 2
        },
        {
          id: "LI003",
          text: "{player} hãy luồn tay qua tóc, vuốt ve và massage nhẹ nhàng vùng gáy cho {partner} trong 1 phút.",
          heart_reward: 3,
          desire_reward: 1
        },
        {
          id: "LI004",
          text: "{player} hãy ôm {partner} thật chặt vào lòng, vùi mặt vào hõm cổ và hít hà mùi hương của {partner} trong 30 giây.",
          heart_reward: 3,
          desire_reward: 2
        },
        {
          id: "LI005",
          text: "{player} hãy đặt một nụ hôn nhẹ nhàng, ấm áp lên trán {partner} và nói một điều {player} biết ơn nhất về mối quan hệ này.",
          heart_reward: 3,
          desire_reward: 1
        },
        {
          id: "LI006",
          text: "{player} hãy dùng hai tay nâng khuôn mặt {partner}, miết nhẹ và vuốt ve bờ môi họ bằng ngón cái trong 15 giây.",
          heart_reward: 2,
          desire_reward: 2
        },
        {
          id: "LI007",
          text: "{player} hãy để {partner} quay lưng lại, và massage dọc sống lưng cho {partner} trong 2 phút mà không nói một lời nào.",
          heart_reward: 2,
          desire_reward: 2
        }
      ],
      tease: [
        {
          id: "LT001",
          text: "{player} và {partner} hãy trao nhau một nụ hôn kiểu Pháp thật ướt át trong 30 giây, nhưng TUYỆT ĐỐI không dùng tay chạm vào người nhau.",
          heart_reward: 2,
          desire_reward: 4
        },
        {
          id: "LT002",
          text: "{player} hãy phả hơi thở ấm nóng vào tai {partner}, và dùng giọng trầm/nhẹ nhàng nhất để nói một lời khơi gợi.",
          heart_reward: 1,
          desire_reward: 4
        },
        {
          id: "LT003",
          text: "{player} hãy cởi bỏ một món đồ trên người {partner} (hoặc tự cởi của mình) chỉ bằng MỘT TAY hoặc bằng RĂNG.",
          heart_reward: 1,
          desire_reward: 5
        },
        {
          id: "LT004",
          text: "{player} hãy dùng đầu ngón tay vuốt ve từ dái tai {partner}, trượt chậm rãi xuống cổ và dừng lại ở ngực trong 20 giây.",
          heart_reward: 2,
          desire_reward: 4
        },
        {
          id: "LT005",
          text: "{player} hãy nhéo nhẹ hoặc cắn khẽ một cách âu yếm vào dái tai của {partner} rồi thì thầm một tiếng thở dài.",
          heart_reward: 1,
          desire_reward: 4
        },
        {
          id: "LT006",
          text: "{player} hãy di chuyển ngón tay vuốt ve dọc đùi trong của {partner} và dừng lại ngay khi sự kích thích bắt đầu.",
          heart_reward: 1,
          desire_reward: 5
        },
        {
          id: "LT007",
          text: "{player} hãy dùng đầu lưỡi liếm nhẹ một đường dọc theo sống cổ hoặc sau gáy của {partner}.",
          heart_reward: 1,
          desire_reward: 4
        }
      ],
      passion: [
        {
          id: "LP001",
          text: "🔥 MỞ KHÓA ƯỚC NGUYỆN: Hệ thống sẽ chọn ngẫu nhiên 1 mong muốn bí mật của {partner}. {player} hãy thực hiện nó ngay nhé!",
          heart_reward: 3,
          desire_reward: 10
        },
        {
          id: "LP002",
          text: "{partner} hãy dùng một dải lụa hoặc áo bịt mắt {player} lại, sau đó nhẹ nhàng hôn và chạm vào 3 điểm nhạy cảm tùy ý trên cơ thể {player}.",
          heart_reward: 2,
          desire_reward: 8
        },
        {
          id: "LP003",
          text: "{player} hãy ôm chầm lấy {partner}, nhìn thẳng vào mắt và nói rõ điều cuồng nhiệt nhất {player} muốn làm với {partner} ngay lúc này.",
          heart_reward: 4,
          desire_reward: 7
        },
        {
          id: "LP004",
          text: "{player} hãy hôn {partner} ở vùng nhạy cảm mà {player} biết chắc chắn {partner} sẽ thích nhất, kéo dài ít nhất 45 giây.",
          heart_reward: 3,
          desire_reward: 9
        },
        {
          id: "LP005",
          text: "{player} hãy kéo {partner} ngồi sát vào lòng mình và trao một nụ hôn thật sâu, mãnh liệt không dứt trong đúng 1 phút.",
          heart_reward: 3,
          desire_reward: 8
        },
        {
          id: "LP006",
          text: "{player} hãy cởi áo của mình (hoặc giúp {partner} cởi áo) một cách thật chậm rãi, giao tiếp ánh mắt và quyến rũ nhất có thể.",
          heart_reward: 2,
          desire_reward: 9
        },
        {
          id: "LP007",
          text: "🔥 DOUBLE DARE: Cả hai cùng cởi bỏ một món đồ lót của mình ra ngay bây giờ. Ai từ chối sẽ phải uống cạn 1 ly đầy!",
          heart_reward: 2,
          desire_reward: 10
        }
      ]
    }
  }
};
