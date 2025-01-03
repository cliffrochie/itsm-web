import {
  CheckCircle,
  Circle,
  CircleOff,
  Timer,
} from "lucide-react"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Circle
  },
  {
    value: "processing",
    label: "Processing",
    icon: Timer
  },
  {
    value: "success",
    label: "Success",
    icon: CheckCircle
  },
  {
    value: "failed",
    label: "Failed",
    icon: CircleOff
  }
]

export const payments: Payment[] = [
    {
      id: "9d101b99-ac68-4dc6-bad1-923915e682d3",
      status: "processing",
      email: "Chris_Legros4@gmail.com",
      amount: 5852.11
    },
    {
      id: "55da195b-021a-4bde-a4d7-93d5c59de1d9",
      status: "processing",
      email: "Raegan1@gmail.com",
      amount: 5260.11
    },
    {
      id: "97493168-9a9b-4363-a5f2-40d26e61f472",
      status: "pending",
      email: "Damion.Durgan@example.com",
      amount: 6237.98
    },
    {
      id: "c17da68d-0516-44a1-abff-524d6f3e5ecb",
      status: "success",
      email: "Edison.Kihn44@example.com",
      amount: 4255.11
    },
    {
      id: "821a73cb-2f5e-4e0b-b3c0-9d26bc97f8e4",
      status: "processing",
      email: "Gudrun_Prohaska98@example.com",
      amount: 8999.6    
    },
    {
      id: "e6b50b01-3085-4785-a0ad-1a177d883202",
      status: "success",
      email: "Rosanna_Reichel3@gmail.com",
      amount: 1716.79
    },
    {
      id: "ee933545-96f8-4ed0-816c-e1624a146d00",
      status: "processing",
      email: "Joaquin_Heidenreich78@example.com",
      amount: 5676.34
    },
    {
      id: "5ec17268-4484-47f8-a697-6bf2135deae4",
      status: "success",
      email: "Gerry10@gmail.com",
      amount: 4929.34
    },
    {
      id: "4e379121-4e80-41b4-b6ef-8bd3e5355465",
      status: "processing",
      email: "Luciano_Hickle@gmail.com",
      amount: 6085.29
    },
    {
      id: "79cec340-3db8-404a-b77a-404c78131027",
      status: "processing",
      email: "Deanna13@gmail.com",
      amount: 7012.63
    },
    {
      id: "789312bb-2a1b-45a7-a32d-fc3b02b38178",
      status: "pending",
      email: "Fabiola4@gmail.com",
      amount: 7002.5    
    },
    {
      id: "7e338b76-cf80-4178-9e19-789017434574",
      status: "pending",
      email: "Theodora.Stokes@example.com",
      amount: 3604.97
    },
    {
      id: "79a7772b-0106-45d4-9cc1-7239c4870641",
      status: "failed",
      email: "Horace.Satterfield91@example.com",
      amount: 5046.82
    },
    {
      id: "f5820d02-7685-461e-987c-0747a32ff3da",
      status: "processing",
      email: "Mallory_Fisher89@gmail.com",
      amount: 3019.68
    },
    {
      id: "225679cd-b845-4dc0-a163-203e68329480",
      status: "failed",
      email: "Desmond_Gutmann@gmail.com",
      amount: 4810.81
    },
    {
      id: "facd64f9-fc92-4e89-8c79-3c681bb6d9e0",
      status: "success",
      email: "Cecil.Wisoky@gmail.com",
      amount: 6096.49
    },
    {
      id: "f1678dd6-dbb8-4885-a28e-ed7934f17eeb",
      status: "failed",
      email: "Freida_Crist@example.com",
      amount: 6314.03
    },
    {
      id: "04fa3140-1f34-4930-8310-921a31b93410",
      status: "success",
      email: "Cassandre.Koelpin4@gmail.com",
      amount: 7473.95
    },
    {
      id: "44e380ca-e827-4498-8618-4c84fdd838fc",
      status: "pending",
      email: "Monique.Greenholt59@gmail.com",
      amount: 7394.77
    },
    {
      id: "8ba8c657-0e33-420e-94e2-aff33e8fa040",
      status: "processing",
      email: "Keagan_Beier20@example.com",
      amount: 3631.3   
    },
    {
      id: "d0811f30-f0cc-4efa-9e62-df949fc50683",
      status: "success",
      email: "Buford.Ritchie@example.com",
      amount: 2753.24
    },
    {
      id: "64adead8-5d6f-40ab-962c-ecbb5d59238f",
      status: "success",
      email: "Cecilia_Welch@gmail.com",
      amount: 4881.39
    },
    {
      id: "0a5a1ca8-2431-4d33-b03d-574be691a60d",
      status: "success",
      email: "Nola.Gislason@example.com",
      amount: 8296.62
    },
    {
      id: "91a77100-299a-4dcf-a038-509e4369766e",
      status: "failed",
      email: "Rusty_Murazik@example.com",
      amount: 8046.98
    },
    {
      id: "152a7ede-b074-49f2-9569-576cb534be79",
      status: "processing",
      email: "Aylin_Stroman75@gmail.com",
      amount: 4072.88
    },
    {
      id: "865279a1-3938-4435-8017-3a4f9440f0f7",
      status: "processing",
      email: "Pablo1@gmail.com",
      amount: 1007.02
    },
    {
      id: "0e0333f2-ae22-4ea3-97c8-7cea4cfd7c40",
      status: "pending",
      email: "Camren_Lindgren10@example.com",
      amount: 6262.86
    },
    {
      id: "c164e2bc-d2bd-4be7-a8f9-b63ff631b040",
      status: "processing",
      email: "Branson_Emard85@gmail.com",
      amount: 5927.78
    },
    {
      id: "2f70736d-ff89-4d6b-a0eb-9f5ea22cb760",
      status: "pending",
      email: "Queenie_Swaniawski88@gmail.com",
      amount: 3144.81
    },
    {
      id: "4f36da9d-a938-4c85-9e59-ffe9b2e369da",
      status: "failed",
      email: "Alfredo66@gmail.com",
      amount: 3618.7   
      },
    {
      id: "fc8c4021-7088-47a5-89d5-cc39c856668e",
      status: "failed",
      email: "Korbin61@gmail.com",
      amount: 7373.61
    },
    {
      id: "6ac3fa21-c0ac-42ab-aa5d-ac3226d7b9a1",
      status: "failed",
      email: "Myrtie.Smitham78@example.com",
      amount: 2049.41
    },
    {
      id: "42d51459-6a40-4bfc-91b1-57bfcdc74a95",
      status: "processing",
      email: "Reese_Durgan12@example.com",
      amount: 6510.5    
      },
    {
      id: "b0288e92-6848-440c-bccc-f41c7d497683",
      status: "success",
      email: "Malachi.Champlin43@example.com",
      amount: 6500.66
    },
    {
      id: "f122f943-2684-45a2-883b-a24361492c3e",
      status: "failed",
      email: "Geovanni.Bergnaum68@gmail.com",
      amount: 8301.79
    },
    {
      id: "6eb74852-fd2e-4abd-8543-686b2ae79813",
      status: "success",
      email: "Jalon_White@example.com",
      amount: 3569.23
    },
    {
      id: "81147703-818c-4ec4-bb4b-386f77749955",
      status: "failed",
      email: "David_Ebert-Leannon54@example.com",
      amount: 5101.93
    },
    {
      id: "2138ef9d-ff9d-459f-ab1a-48e5772bfb69",
      status: "failed",
      email: "Beau.Blick43@gmail.com",
      amount: 5064.32
    },
    {
      id: "5efd6b1f-3ef1-4415-98ba-b6a15a1ca0b1",
      status: "processing",
      email: "Itzel.Bednar@gmail.com",
      amount: 7582.82
    },
    {
      id: "0b9f4722-a17d-4e3e-a7e9-93e2e2debd1d",
      status: "failed",
      email: "Karli.Dickens@example.com",
      amount: 6387.41
    },
    {
      id: "7161f2c2-fe1f-41f3-b0a1-44b6b17f674f",
      status: "processing",
      email: "Garfield17@gmail.com",
      amount: 1563.09
    },
    {
      id: "0b754cb0-cdf7-44d1-9982-6e9a63aac280",
      status: "processing",
      email: "Mose.Rutherford@gmail.com",
      amount: 1510.35
    },
    {
      id: "0187323f-b2e1-4612-bdef-4fb33c78634f",
      status: "processing",
      email: "Lorena11@example.com",
      amount: 7838.75
    },
    {
      id: "243e975d-9110-4dbd-b4fe-4c5905789de9",
      status: "pending",
      email: "Carlie_Baumbach56@example.com",
      amount: 1383.06
    },
    {
      id: "a9c87e61-168a-4a40-8e92-06dfe4d3e323",
      status: "failed",
      email: "Ruben.Mills@example.com",
      amount: 8040.92
    },
    {
      id: "c7db6b79-52e9-42ff-930b-c9c9d79b684a",
      status: "processing",
      email: "Ruben_Abbott42@example.com",
      amount: 8102.82
    },
    {
      id: "82633877-7088-4e7f-9f6d-937c0bc2b433",
      status: "failed",
      email: "Wava28@example.com",
      amount: 6406.59
    },
    {
      id: "bb87c6b6-b5fc-4b5a-8724-a6e6159f9d6d",
      status: "success",
      email: "Adrain.VonRueden14@example.com",
      amount: 3756.96
    },
    {
      id: "2404df00-7a5c-47c9-a6e9-095ee6f174ad",
      status: "pending",
      email: "Ryley_Herman@gmail.com",
      amount: 4743.6    
      },
    {
      id: "093e2b16-cd16-4ecd-97b3-7b3f82004c1d",
      status: "pending",
      email: "Ernestina.Murazik15@gmail.com",
      amount: 8746.46
    },
    {
      id: "67f5e915-38e8-4e23-9589-e6c1a6d80ce6",
      status: "pending",
      email: "Elta86@gmail.com",
      amount: 1265.92
    },
    {
      id: "36f84208-d0b3-4d75-bd7c-acb614531431",
      status: "failed",
      email: "Josue75@example.com",
      amount: 6821.11
    },
    {
      id: "5facd698-d00d-4d1a-b022-1bed671b4cf1",
      status: "failed",
      email: "Vivianne.Orn@gmail.com",
      amount: 6834.05
    },
    {
      id: "689d13a9-e50f-4c6c-806d-ad43297c562e",
      status: "success",
      email: "Tanya.Gerlach@example.com",
      amount: 2999.9    
      },
    {
      id: "23986983-0236-4689-8c7e-702483db42ca",
      status: "success",
      email: "Margie.Feest67@example.com",
      amount: 2906.08
    },
    {
      id: "723395a5-5122-4805-85c3-27703c17ce94",
      status: "pending",
      email: "Minerva14@example.com",
      amount: 2937.28
    },
    {
      id: "4f15c185-f0cd-44dd-abec-27deeb30e590",
      status: "pending",
      email: "Maudie_Russel@example.com",
      amount: 1445.08
    },
    {
      id: "7019aaeb-7bb1-436d-bb99-93d7a253b2ae",
      status: "processing",
      email: "Zoila_Schoen@example.com",
      amount: 1466.81
    },
    {
      id: "ab67800a-38da-48d3-aee2-c5c6023127a4",
      status: "processing",
      email: "Mariela.Gutmann@example.com",
      amount: 3441.28
    },
    {
      id: "1c168cb5-fdea-48e4-b529-7d3105038b4f",
      status: "pending",
      email: "Adrienne_Murray76@example.com",
      amount: 4524.62
    },
    {
      id: "5f7f5915-930e-44ce-89eb-b6e99124e513",
      status: "failed",
      email: "Kelley_Denesik@gmail.com",
      amount: 7720.21
    },
    {
      id: "6528dfa9-a04a-419d-9114-f528f3544f4a",
      status: "success",
      email: "Lisette.Romaguera@example.com",
      amount: 3323.72
    },
    {
      id: "acad1bad-75d3-4ac0-8268-096f345b2739",
      status: "failed",
      email: "Kareem_Cremin77@example.com",
      amount: 2065.1   
      },
    {
      id: "95028b67-8114-4ec6-9e2e-715e9ad52593",
      status: "pending",
      email: "Lora.Greenholt52@gmail.com",
      amount: 2627.49
    },
    {
      id: "1f83400f-79d7-4080-8d77-066e5b8894cd",
      status: "processing",
      email: "Rhea_Kris59@example.com",
      amount: 1319.45
    },
    {
      id: "4ba261f0-1c48-45de-a63c-9221718c0396",
      status: "processing",
      email: "Elisa_Wuckert@gmail.com",
      amount: 1195.69
    },
    {
      id: "0b43f159-b600-4f33-b0d0-5cb725d28763",
      status: "failed",
      email: "Rosario75@example.com",
      amount: 3688.45
    },
    {
      id: "f0371ede-7c2c-4339-8ec8-8becad7ba4fc",
      status: "success",
      email: "Peyton.Crooks21@example.com",
      amount: 2246.83
    },
    {
      id: "7d60cbf4-2f44-4383-9ef9-16f5d5cb2e3c",
      status: "failed",
      email: "Leland17@example.com",
      amount: 6295.12
    }
  ]