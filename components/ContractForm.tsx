/* This component contains the popup window that displays when user want to ceate a new tender */
/* the main components 
1. User Information Form 
2. Location using map
3. Offer details form
4. Offer quantites table
5. Multi documents upload field (execl, word, images)
6. Last date for answer submission
*/

"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
//import QRCode from "qrcode";
import { QRCode } from "react-qrcode-logo";
import { v4 as uuidv4 } from "uuid";

/******************* We are using zod to vatidate all input fields ******************/
const validationSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  phone: z.string().min(8, {
    message: "Numéro de téléphone doit comporter au moins 8 caractères",
  }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),

  /*   tenderDescription: z
    .string()
    .min(1, { message: "company description is required" }), */
});

type ValidationSchema = z.infer<typeof validationSchema>;

/*************************************************************************************/

/******************************* Input Field Component *******************************/

const InputFieldComponent = ({
  type,
  lableText,
  inputPlaceholder,
  inputType,
  zodError,
  zodRgister,
}: any) => (
  <div className="flex flex-col items-start justify-start mb-2 md:mb-0 w-full">
    <label className="text-lg font-bold text-gray-400 w-full" htmlFor={type}>
      {lableText}
    </label>
    <input
      className={`flex-1 px-3 py-2 text-lg leading-tight text-gray-400 border w-full ${
        zodError && "border-red-500"
      } rounded-lg appearance-none focus:outline-none focus:shadow-outline focus:border-amber-500`}
      id={type}
      type={inputType}
      placeholder={inputPlaceholder}
      {...zodRgister(type)}
    />
    {zodError && (
      <p className="text-xs italic text-red-500 mt-2">{zodError?.message}</p>
    )}
  </div>
);

/*************************************************************************************/

const ContractForm = () => {
  /* Zod function to validate schema and submitt forms 
   tanstack query with axios for queries managment */
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [uniqueId, setUniqueId] = useState(uuidv4());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
  });

  /******************* QR code Creation ******************/
  useEffect(() => {
    try {
      const canvas = document.getElementById("QR") as HTMLCanvasElement;
      if (canvas) {
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        setQrCodeUrl(pngUrl);
        /*         let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `your_name.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink); */
      }
      toast.success("QR Code Generated Succefully");
    } catch (error) {
      toast.error("Use erreur c'est produit");
    }
  }, []);

  /******************* Pdf Creation Compoenent ******************/

  // Create styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingVertical: 30,
    },
    section: {
      marginBottom: 10,
    },

    headerSection: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },

    header: {
      fontWeight: "bold",
      fontSize: 30,
    },

    logoSection: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      marginTop: 10,
    },

    logo: {
      width: 250,
      height: 250,
      backgroundColor: "#000000",
      objectFit: "contains",
      borderWidth: 0.2,
      borderColor: "#000000",
      padding: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subname: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
    footer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 15,
    },
  });
  // Create Document Component
  const MyDocument = ({
    name,
    phone,
    email,
    tenderDescription,
    codeUrl,
  }: any) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerSection}>
          <Text style={styles.header}>Contrat d'Abonnement</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            Date: {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.text}>Lieu: Tunisie</Text>
          <Text style={styles.text}>Identifiant Commita: {uniqueId}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Entre:</Text>
          <Text style={styles.text}>Nom: Commita</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>Et:</Text>
          <Text style={styles.text}>Nom: {name}</Text>
          <Text style={styles.text}>Téléphone: {phone}</Text>
          <Text style={styles.text}>Email: {email}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subname}> 1. Objet du contrat</Text>
          <Text style={styles.text}>
            Le Client souscrit à un abonnement auprès du Fournisseur selon les
            termes et conditions énoncés dans le présent contrat. Cet abonnement
            est de type [Précisez le type d'abonnement] et permet au Client de
            bénéficier des avantages et des conditions détaillés à l'article 3.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subname}> 2. Durée de l'abonnement</Text>
          <Text style={styles.text}>
            La durée de l'abonnement est de [Précisez la durée de l'abonnement]
            à compter de la date de signature du présent contrat. À l'expiration
            de cette période, l'abonnement sera automatiquement renouvelé pour
            des périodes successives de [Précisez la durée du renouvellement] à
            moins que l'une des parties ne donne un préavis écrit de résiliation
            au moins [Précisez le délai de préavis] avant la date d'expiration
            de l'abonnement en cours.
          </Text>
        </View>
        {/* <View style={styles.section}>
          <Text style={styles.header}> 3. Avantages et conditions</Text>
          <Text style={styles.text}>
            Le Client bénéficiera des avantages suivants pendant la durée de
            l'abonnement:
          </Text>
          <Text style={styles.text}>
            &#8226; [Listez les avantages spécifiques]
          </Text>
          <Text style={styles.text}>
            Le Client s'engage à respecter les conditions suivantes:
          </Text>
          <Text style={styles.text}>
            &#8226; [Listez les conditions spécifiques]
          </Text>
        </View>
                <View style={styles.section}>
          <Text style={styles.header}> 4. Paiement</Text>
          <Text style={styles.text}>
            Le Client s'engage à payer au Fournisseur les frais d'abonnement
            selon les modalités suivantes:
          </Text>
          <Text style={styles.text}>
            &#8226; Montant: [Précisez le montant des frais d'abonnement]
          </Text>
          <Text style={styles.text}>
            &#8226; Fréquence de paiement: [Précisez la fréquence de paiement,
            par exemple mensuelle, annuelle, etc.]
          </Text>
          <Text style={styles.text}>
            &#8226; Mode de paiement: [Précisez les modes de paiement acceptés]
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}> 5. Résiliation</Text>
          <Text style={styles.text}>
            Chaque partie peut résilier le présent contrat avant la fin de la
            période d'abonnement en cas de violation substantielle de l'une des
            clauses du contrat par l'autre partie. La résiliation doit être
            notifiée par écrit à l'autre partie avec un préavis de [Précisez le
            délai de préavis]. En cas de résiliation, le Client n'aura droit à
            aucun remboursement des frais d'abonnement déjà payés.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}> 6. Confidentialité</Text>
          <Text style={styles.text}>
            Les parties conviennent de traiter toutes les informations
            confidentielles échangées dans le cadre du présent contrat de
            manière confidentielle et de ne les divulguer à aucun tiers sans le
            consentement écrit préalable de l'autre partie
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            {" "}
            7. Loi applicable et règlement des litiges
          </Text>
          <Text style={styles.text}>
            Le présent contrat est régi et interprété conformément aux lois de
            [Pays]. Tout litige découlant du présent contrat sera soumis à la
            compétence exclusive des trib
          </Text>
        </View> */}
        <View style={styles.logoSection}>
          <Image style={styles.logo} src={codeUrl} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.subname}>Signature</Text>
        </View>
      </Page>
    </Document>
  );

  const downloadPDF = async (data: any) => {
    try {
      const blob = await pdf(<MyDocument {...data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Contract-${data?.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Contrat generated avec succee");
    } catch (error) {
      toast.error("Erreur Generation Contrat");
    }
  };

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      /* 1. Check if the table has empty values */
      downloadPDF({ ...data, codeUrl: qrCodeUrl });
      toast.success("Telechargment acompli");
    } catch (error) {
      toast.error("erreur soummission contrat");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col items-center justify-center w-full md:w-[50%] gap-8 p-8 border border-black rounded-2xl">
        <form
          className="flex flex-col items-center justify-center w-full h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="w-full text-center font-bold text-2xl">
            Formulaire de Contract
          </h1>
          <InputFieldComponent
            type="name"
            lableText="Nom"
            inputPlaceholder="Nom"
            inputType="text"
            zodError={errors.name}
            zodRgister={register}
          />
          <InputFieldComponent
            type="phone"
            lableText="Téléphone"
            inputPlaceholder="Numero Téléphone"
            inputType="number"
            zodError={errors.phone}
            zodRgister={register}
          />
          <InputFieldComponent
            type="email"
            lableText="Addresse Email"
            inputPlaceholder="Email"
            inputType="email"
            zodError={errors.email}
            zodRgister={register}
          />

          <div className="flex items-center justify-center w-full gap-4 mt-8">
            <button
              type="button"
              className="inline-flex items-center justify-center w-32 h-12 text-sm font-medium text-center text-white border border-amber-500 rounded-xl hover:bg-gray-200  dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800 shadow-md shadow-gray-400 active:translate-y-1"
            >
              <span className="text-lg w-full text-amber-500">Annuler</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center w-32 h-12 text-sm font-medium text-center text-white bg-amber-500 rounded-xl hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800 shadow-md shadow-gray-400 active:translate-y-1"
            >
              Télécharger
            </button>
          </div>
        </form>
        <QRCode
          id="QR"
          value={uniqueId} // here you should keep the link/value(string) for which you are generation promocode
          size={350} // the dimension of the QR code (number)
          logoImage="/ant-logo.png" // URL of the logo you want to use, make sure it is a dynamic url
          logoHeight={70}
          logoWidth={70}
          logoOpacity={1}
          enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
          qrStyle="squares" // type of qr code, wether you want dotted ones or the square ones
          eyeRadius={10} // radius of the promocode eye
        />
        {/*qr && (
          <div className="realtive w-[300px] h-[300px] items-center justify-center">
            <img src={qr} className="absolute w-[300px] h-[300px]" />
          </div>
        )*/}
      </div>
    </div>
  );
};

export default ContractForm;
