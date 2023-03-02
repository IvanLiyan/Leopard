import { ci18n } from "@core/toolkit/i18n";
import { zendeskSectionURL, zendeskURL } from "@core/toolkit/url";
import {
  CommerceTransactionState,
  CounterfeitReason,
  MerchantWarningImpactType,
  MerchantWarningProofDisputeStatus,
  MerchantWarningProofType,
  MerchantWarningReason,
  MerchantWarningState,
  TaggingViolationSubReasonCode,
  TrackingDisputeState,
} from "@schema";

const deprecatedInfractionData = {
  title: "",
  body: i`Wish has deprecated this infraction, which means you cannot receive it again moving forward. However, this infraction may still impact your account.`,
  policy: undefined,
  faq: undefined,
};

type Datum = {
  readonly title: string;
  readonly body: string;
  readonly policy: string | undefined;
  readonly faq: string | undefined;
};

const TaggingViolationSubReasonCodeData: {
  readonly [reason in TaggingViolationSubReasonCode]: Datum & {
    readonly parent: CounterfeitReason;
  };
} = {
  BRAND_DISCREPANCY: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Brand Discrepancy"),
    body: i`Wish received written feedback indicating the product received was not the brand of the item being advertised in the listing. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold. [Learn more](${"https://merchant.wish.com/policy/inappropriate-reasons/33"}).`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  CONFEDERATE_FLAG: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Confederate Flag"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RECREATIONAL_DRUGS_AND_CHEMICALS: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Recreational Drugs and Chemicals"),
    body: i`At this time, Wish prohibits the sale of all recreational drugs, research chemicals, party drugs, and controlled substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SUBSCRIPTIONS_OR_MEMBERSHIPS: {
    parent: "VIRTUAL_GOODS",
    title: ci18n(
      "name of infraction",
      "Subscriptions to Channels, Websites, or Other Memberships",
    ),
    body: i`All goods sold on Wish must be tangible products. The sale of subscriptions to television channels, websites, or other memberships is not permitted. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DOMESTIC_TERRORISTS_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Domestic Terrorists Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HYPERREALISTIC_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Hyperrealistic Content"),
    body: i`Wish does not allow realistic sexual wellness products such as (but not limited to) life-like or flesh-like sex dolls and/or body parts. This product may not be relisted.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANT_SEED_WITH_IMPOSSIBLE_CLAIM: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of infraction", "Plant Seeds with Impossible Claims"),
    body: i`The images and/or description for these plant seeds make impossible claims. Misuse of images and other listing elements to falsely promote a product is not permitted.This listing may be reactivated if such images or references are removed.`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DANGEROUS_NON_CPA_VIOLATION: {
    parent: "DANGEROUS_ITEMS",
    title: ci18n("name of infraction", "Non-CPA Takedown"),
    body: i`Wish does not permit the sale of products which may potentially or actually be dangerous or unsafe to consumers, their property, and/or that may violate safety standards, laws, or regulations. This product may not be relisted.`,
    policy: i`[Dangerous and Unsafe Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/46"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PRODUCT_VARIANCE: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of infraction", "Product Variance"),
    body: i`There are multiple products being sold in this product listing. Please make all available options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PRESCRIPTION_STRENGTH_ITEMS: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Prescription Strength Items"),
    body: i`At this time, Wish prohibits the sale of prescription strength items. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NOT_FOCUS_OF_MAIN_IMAGE: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "Product is not the focus of the main image",
    ),
    body: i`The first image in this listing does not clearly show the product being sold.  The product being sold occupies 25% or less of the main image and is utilized in relation to another product that is not for sale. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  REVIEW_SHOW_WRONG_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "Customer Feedback About Different Product",
    ),
    body: i`The product reviews from our customers indicate the product received was fundamentally different (e.g., serves a different function, product is an entirely different category of product or looks completely different) than the item being advertised. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  SPY_CAMERAS: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n(
      "name of infraction",
      "Spy Cameras with Sexually Exploitive Surveillance Images",
    ),
    body: i`At this time, Wish prohibits the sale of surveillance equipment sold with the explicit intention of sexual or illicit purposes. This product may be relisted if such images are removed.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TERRORIST_PROMOTION_GROUPS: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Terrorist Promotion Groups"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  EURO_CURRENCY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n("name of infraction", "Euro Currency"),
    body: i`At this time, Wish prohibits the sale of euro currency. This product may not be relisted.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ASSAULT_WEAPON_CONVERSION_PIECES: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Assault Weapon Conversion Pieces"),
    body: i`At this time, Wish prohibits the sale of all firearm parts and accessories used to convert the machine into an assault weapon. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SIZE_MISREPRESENTATION_MAIN_IMAGE: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "Size Misrepresentation (Product Image Only)",
    ),
    body: i`The images showcase the product size to be much larger than what is actually being sold in this listing. Please make sure all photos of this listing represent the product actually being sold and do not create a false impression or confusion for your customers. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  SIZE_NOT_AS_ADVERTISED: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Description & Size Not as Advertised"),
    body: i`The description and/or package size does not reflect the same product as the title and/or images. Please update the title and/or images and create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  SEXUALLY_SUGGESTIVE_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Sexually Suggestive Content"),
    body: i`Wish does not allow listings that include sexually suggestive content in the title, images, and/or description. If such content is removed, the listing may be reactivated.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  LISTING_PROMOTES_HIDING_PROHIBITED_SUBSTANCE: {
    parent: "SMOKING",
    title: ci18n(
      "name of infraction",
      "Listing Promotes Hiding Prohibited Substance",
    ),
    body: i`At this time, Wish prohibits the sale of products that promote the concealment of prohibited substances. If such content is removed, the listing may be reactivated.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PENICILLIN: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Penicillin"),
    body: i`At this time, Wish prohibits the sale of penicillin. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RATING_SHOW_WRONG_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "Customer Images Show Different Product",
    ),
    body: i`The product review images from our customers indicate the product received was fundamentally different (e.g., serves a different function, product is an entirely different category of product, or looks completely different) than the item being advertised. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  UNREASONABLE_SPEC: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Unreasonable or Exaggerated Spec"),
    body: i`Listings and/or product variations advertising devices with false, exaggerated, unreasonable, or impossible capacities/specifications are prohibited on Wish. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  HUMAN_GROWTH_HORMONE: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Human Growth Hormone"),
    body: i`At this time, Wish prohibits the sale of human growth hormone. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEATBELTS: {
    parent: "SAFETY_EQUIPMENT",
    title: ci18n("name of infraction", "Seatbelts & Seatbelt Extenders"),
    body: i`The sale of seatbelts and seatbelt extenders is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Safety Equipment Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/38"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FULLY_LOADED_TV_BOXES: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n("name of infraction", "Fully Loaded TV Boxes"),
    body: i`At this time, Wish prohibits the sale of media streaming devices that provide unauthorized access to content. This product may not be relisted.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_SILENCER_COMPONENTS: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Gun Silencer Components"),
    body: i`At this time, Wish prohibits the sale of any material component/parts that can be used to build a silencer or attach a silencer to a firearm. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  LIVE_ANIMAL: {
    parent: "ANIMAL_PRODUCTS",
    title: ci18n("name of infraction", "Living Animals"),
    body: i`At this time, Wish prohibits the sale of live animals. This product may not be relisted.`,
    policy: i`[Animal Products Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/41"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERIFIED_WARRANTIES: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of infraction", "Unverified Warranties"),
    body: i`At this time, Wish prohibits listings containing unverified warranties or guarantees. The sale of verified warranties is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ALCOHOL: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of infraction", "Alcohol"),
    body: i`At this time, Wish prohibits the sale of alcohol. This product may not be relisted.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TOBACCO: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Tobacco"),
    body: i`At this time, Wish prohibits the sale of tobacco and/or products that contain tobacco. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SIZE_MISPRESENTATION: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "Size Misrepresentation (Product Image Only)",
    ),
    body: i`The images showcase the product size to be much larger than what is actually being sold in this listing. Please make sure all photos of this listing represent the product actually being sold and do not create a false impression or confusion for your customers. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  POPPERS_AND_MUSCLE_RELAXANTS: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Poppers and Muscle Relaxants"),
    body: i`At this time, Wish prohibits the sale of poppers and other recreational muscle relaxant drugs. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATEFUL_IMAGERY: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Hateful Imagery"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNREALISTIC_HEALTH_CLAIM_PRODUCTS: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of infraction", "Unrealistic Health Claims"),
    body: i`Products or listings which advertise, promote, allude to, and/or depict any results for health and health-related, or personal care products without adequate substantiation are not permitted on Wish. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_SILENCER_MISUSE: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Gun Silencer Misuse"),
    body: i`At this time, Wish prohibits the sale of any item intended for use as a silencer or commonly misused as a silencer. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SELF_FEEDING_BABY_PILLOWS: {
    parent: "RECALLED_TOYS",
    title: ci18n("name of infraction", "Self Feeding Baby Pillows"),
    body: i`At this time, self-feeding baby pillows are prohibited on Wish. This product may not be relisted.`,
    policy: i`[Recalled Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/18"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL(
      "205211777",
    )}), [What are recalled or prohibited items?](${zendeskURL(
      "4421452343959",
    )})`,
  },
  METAL_NINJA_STARS: {
    parent: "WEAPON",
    title: ci18n(
      "name of infraction",
      "Real, Metal Ninja Stars (Throwing Stars)",
    ),
    body: i`At this time, Wish prohibits the sale of all throwing stars. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HOUSEKEEPING_TOUR_PACKAGES: {
    parent: "VIRTUAL_GOODS",
    title: ci18n(
      "name of infraction",
      "Housekeeping, Tour Packages, or Other Services",
    ),
    body: i`All goods sold on Wish must be tangible products. At this time, Wish prohibits the sale of housekeeping, tour packages, or other services. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERIFIED_LOGO: {
    parent: "FALSE_ADVERTISING",
    title: ci18n(
      "name of infraction",
      "Unverified Logos from Credible Agencies",
    ),
    body: i`At this time, Wish prohibits listings containing unverified logos from credible agencies. This listing may be reactivated if such images or references are removed.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RANDOM_PRODUCT: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of infraction", "Random / Undefined Product"),
    body: i`Listing titles, images, price points, size/color options, style variations, and descriptions should all align with the product being sold. Please make all available options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NUDE_MINOR_IN_NON_SEXUAL_CONTEXT: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Nude Minor in Non-Sexual Context"),
    body: i`Listings which contain images of a nude minor (including partial nudity) are not permitted on Wish. The listing may be reactivated if such images are removed.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MERCAHNT_CONTACT_OR_REFERAL: {
    parent: "FALSE_ADVERTISING",
    title: ci18n(
      "name of infraction",
      "Merchant Contact or Referral Information",
    ),
    body: i`At this time, Wish prohibits listings containing merchant contact or referral information. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RACIAL_CLEANSING: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Racial Cleansing"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANTS: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of infraction", "Plants"),
    body: i`The sale of plants is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VITAMINS_AND_SUPPLEMENTS: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of infraction", "Vitamins & Supplements"),
    body: i`The sale of vitamins and supplements is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FOOD: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of infraction", "Food"),
    body: i`The sale of food is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NON_CLINICAL_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Non-Clinical Content"),
    body: i`Wish does not allow sexual wellness product listings where the product is not the primary focus of the image. Sexual wellness product listings must include images that clearly depict the product for sale against a white or transparent backdrop and/or be free of blurring or censoring. To reactivate this listing, ensure all images comply with Wish Policies.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ENDANGERED_SPECIES: {
    parent: "ANIMAL_PRODUCTS",
    title: ci18n("name of infraction", "Endangered Species"),
    body: i`At this time, Wish prohibits the sale of any animal (live or deceased) that is a threatened or endangered species and/or products containing or made from endangered species or their parts. This product may not be relisted.`,
    policy: i`[Animal Products Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/41"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MOD_BOXES: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Mod Boxes"),
    body: i`At this time, Wish prohibits the sale of Mod Boxes and/or any other electrical accessories used for the consumption of smokable substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNSUPPORTED_MEDICAL_CLAIMS: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Unsupported Medical Claims"),
    body: i`The listing advertises the use of unsupported medical claims and/or images that set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  BULLYING: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Bullying"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEXUALLY_EXPLICIT_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Sexually Explicit Content"),
    body: i`Wish does not allow listings that include sexually explicit content in the title, images, and/or description. If such content is removed, the listing may be reactivated.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  OTC_MEDICATION: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "OTC Medication"),
    body: i`The sale of over the counter medication is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HOVERBOARDS: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Hoverboards"),
    body: i`At this time, Wish prohibits the sale of Hoverboards. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  BENZENE: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Products that contain Benzene"),
    body: i`At this time, Wish prohibits the sale of Benzene and/or any product containing Benzene. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HUMAN_BY_PRODUCTS: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Human By-Products"),
    body: i`At this time, Wish prohibits the sale of human by-products. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  COUNTERFEIT_CURRENCY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n("name of infraction", "CPA: Counterfeit Currency"),
    body: i`At this time, Wish prohibits the sale of counterfeit currency. This product may not be relisted.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VIRTUAL_MONEY: {
    parent: "VIRTUAL_GOODS",
    title: ci18n("name of infraction", "Virtual Money for Online Games"),
    body: i`All goods sold on Wish must be tangible products. The sale of virtual money or other digital goods is not permitted. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MARIJUANA: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Marijuana / Cannabis"),
    body: i`At this time, Wish prohibits the sale of marijuana, cannabis, and CBD in all forms. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TIRE_SPIKES: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Tire Spikes"),
    body: i`At this time, Wish prohibits the sale of Tire Spikes. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PET_FOOD: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of infraction", "Pet Food"),
    body: i`The sale of pet food is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ECIGARETTE_VAPE: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "E-cigarettes / Vape Pens"),
    body: i`At this time, Wish prohibits the sale of e-cigarettes, vape pens, and any other electrical accessories used for the consumption of smokable substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CHLOROFORM: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Chloroform"),
    body: i`At this time, Wish prohibits the sale of chloroform. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ANTI_GAY: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Anti-gay"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERFIED_PRICE_INFORMATION: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of infraction", "Unverified Price Information"),
    body: i`This listing contains inconsistencies in the product price and falls outside verifiable market rates. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL("mu360005950894")})`,
  },
  TOBACCO_SEEDS: {
    parent: "SMOKING",
    title: ci18n(
      "name of infraction",
      "Tobacco / Marijuana / Cannabis / Hemp Seeds",
    ),
    body: i`At this time, Wish prohibits the sale of tobacco, marijuana, cannabis, hemp seeds, and/or products that appear to contain such substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PROHIBITED_SUBSTANCE_PIPE: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Prohibited Substance Pipe"),
    body: i`At this time, Wish prohibits the sale of pipes that can be used to consume prohibited substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  COMPETITOR_WATERMARK: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of infraction", "Competitor Watermark"),
    body: i`At this time, the use of watermarks, logos, images, and links belonging to other marketplaces is not permitted. Referring users off of Wish is a direct violation of Wish's merchant policies. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ODOMETER_CORRECTION_TOOLS: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n("name of infraction", "Odometer Correction Tools"),
    body: i`At this time, Wish prohibits the sale of odometer correction tools. This product may not be relisted.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PROUD_BOY_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Proud Boy Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CHILD_HARNESS: {
    parent: "SAFETY_EQUIPMENT",
    title: ci18n("name of infraction", "Child Harness"),
    body: i`The sale of child harnesses is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Safety Equipment Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/38"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PILL_PRESSES: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Pill Presses"),
    body: i`At this time, Wish prohibits the sale of pill presses in all forms. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HITLER_IMAGERY: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Hitler Imagery"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  OTHER_WHITE_SUPREMACY_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Other White Supremacy Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SELF_FEEDING_BABY_BOTTLE_CLIPS: {
    parent: "RECALLED_TOYS",
    title: ci18n("name of infraction", "Self Feeding Baby Bottle Clips"),
    body: i`At this time, self-feeding baby bottle clips are prohibited on Wish. This product may not be relisted.`,
    policy: i`[Recalled Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/18"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL(
      "205211777",
    )}), [What are recalled or prohibited items?](${zendeskURL(
      "4421452343959",
    )})`,
  },
  UNAUTHROIZED_USE_WISH: {
    parent: "FALSE_ADVERTISING",
    title: ci18n(
      "name of infraction",
      'Unauthorized Use of "Verified by Wish" or "Wish Express"',
    ),
    body: i`At this time, Wish prohibits listings containing "Verified by Wish" or "Wish Express" without authorization. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NAZI_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Nazi Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATE_SPEECH: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Hate Speech"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MAGNETS_AS_TOYS: {
    parent: "RECALLED_TOYS",
    title: ci18n(
      "name of infraction",
      "Buckyballs / Small Magnets Advertised as Toys",
    ),
    body: i`At this time, all small magnets and/or products that contain small magnets are prohibted on Wish. This product may not be relisted.`,
    policy: i`[Recalled Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/18"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL(
      "205211777",
    )}), [What are recalled or prohibited items?](${zendeskURL(
      "4421452343959",
    )})`,
  },
  IMITATION_CURRENCY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n(
      "name of infraction",
      "Imitation Currency Not Properly Labeled",
    ),
    body: i`At this time, Wish prohibits the sale of imitation currency that is absent of proper labeling. The product may be relisted if such content is properly labeled.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  EXPLOSIVE_WEAPONS: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Explosive Weapons"),
    body: i`At this time, Wish prohibits the sale of explosive and/or combustible weapons. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  US_PROP_MONEY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n("name of infraction", "US Prop Money"),
    body: i`At this time, Wish prohibits the sale of US prop money. This product may not be relisted.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PRICE_POINT_UNREASONABLE: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Price Point Unreasonable"),
    body: i`The price of this item is unreasonably low for the product being sold and is in direct violation of Wish's policies. Please create a new listing that accurately represents the value of the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  CONTACT_LENS_SOLUTION: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Contact Lens Solution"),
    body: i`At this time, Wish prohibits the sale of contact lens solution. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  KKK_PARAPHERNALIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "KKK Paraphernalia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  BEVERAGES: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of infraction", "Beverages"),
    body: i`The sale of non-alcoholic beverages is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CPSC_VIOLATION: {
    parent: "RECALLED_TOYS",
    title: ci18n("name of infraction", "CPA Violation"),
    body: i`Recalled items reported by Consumer Protection Agencies (CPA) or other regulatory agencies are not permitted on Wish. This product may not be relisted.`,
    policy: i`[Recalled Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/18"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL(
      "205211777",
    )}), [What are recalled or prohibited items?](${zendeskURL(
      "4421452343959",
    )})`,
  },
  UNVERIFIED_SHIPPING_TIME_FRAME: {
    parent: "FALSE_ADVERTISING",
    title: ci18n(
      "name of infraction",
      "Unverified Shipping Time Frame Information",
    ),
    body: i`At this time, Wish prohibits listings containing unverified shipping time frame information. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MISLEADING_CLAIMS: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of infraction", "Misleading Claims"),
    body: i`Products and/or listings must comply with all applicable laws and regulations to the product being advertised. Wish prohibits listings with misleading claims and/or statements without adequate substantiation (including exaggerated claims). The title, description, price, size/color options, and images used to advertise a product should clearly and accurately reflect the product being sold. If such content is removed, the listing may be reactivated.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GLYPHOSATE: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Products containing glyphosate"),
    body: i`At this time, Wish prohibits the sale of Glyphosate and/or any product containing Glyphosate. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GIFT_CARDS_OR_ACCESS_CODES: {
    parent: "VIRTUAL_GOODS",
    title: ci18n("name of infraction", "Gift Cards or Access Codes"),
    body: i`All goods sold on Wish must be tangible products. Wish prohibits the sale of gift cards or access codes. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANT_SEEDS: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of infraction", "Plant Seeds"),
    body: i`Wish has detected prohibited content on this listing and has been flagged for violating Wish's Policies on "Plants and Plant Seeds."${"\n\n"}The sale of plant seeds is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish. [Learn more](${"https://merchant.wish.com/policy/inappropriate-reasons/44"}).`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERIFIED_FREE_SHIPPING: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of infraction", "Unverified Free Shipping Claim"),
    body: i`Providing shipping time frame information in the images, title, or description of a product is prohibited on WIsh. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  STANDALONE_LITHIUM_BATTERY: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n(
      "name of infraction",
      "Lithium standalone and lithium-ion battery",
    ),
    body: i`At this time, Wish prohibits the sale of Standalone Lithium or Lithium-Ion batteries. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  LASER_POINTERS: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "High-Powered Laser Pointers"),
    body: i`At this time, Wish prohibits the sale of high-powered laser pointers. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VALUE_VARIANCE: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of infraction", "Value Variance"),
    body: i`This listing contains multiple products with a difference in value of product quality and/or price discrepancies. Please make all available options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEXUALLY_EXPLICIT_MATERIAL: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Sexually Explicit Material"),
    body: i`Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  BULLION: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of infraction", "Bullion"),
    body: i`Counterfeit and/or replica bullion is prohibited on Wish. This product may not be relisted.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  JAMMERS: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n("name of infraction", "Jammers"),
    body: i`At this time, Wish prohibits the sale of signal jammers. This product may not be relisted.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FIREARMS_AND_GUNS: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Firearms / Guns"),
    body: i`At this time, Wish prohibits the sale of Firearms / Guns. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CHILD_CARSEAT: {
    parent: "SAFETY_EQUIPMENT",
    title: ci18n("name of infraction", "Child Car Seat"),
    body: i`The sale of child car seats is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Safety Equipment Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/38"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEXUAL_CONTENT_INCLUDING_MINOR: {
    parent: "NUDITY",
    title: ci18n("name of infraction", "Sexual Content Including Minor"),
    body: i`Products and listings which promote, allude, and/or depict sexual engagement with a minor are not permitted on Wish. This product may not be relisted.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_BUILDING_KITS: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Gun Building Kits"),
    body: i`At this time, Wish prohibits the sale of real gun building kits including instructions, pieces, blueprints, and other materials. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANT_SEED_WITH_IMPOSSIBLE_CLAIM_V2: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of infraction", "Plant Seeds with Impossible Claims"),
    body: i`The images and/or description for these plant seeds make impossible claims. Misuse of images and other listing elements to falsely promote a product is not permitted.This listing may be reactivated if such images or references are removed.`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  IMAGE_NOT_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "All But One of the Images are not of the Product",
    ),
    body: i`All images should accurately include the product that is being sold. Additionally, the main image must always show the product being sold. Please update all images and create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  EYELASH_GROWTH_SERUM: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Eyelash Growth Serum"),
    body: i`At this time, Wish prohibits the sale of eyelash growth serum. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FEEDBACK_ABOUT_NO_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of infraction",
      "Customer Feedback About No Product Received",
    ),
    body: i`The product reviews or image evidence from our customers indicate that many did not receive the product, indicating false tracking, receiving a letter/gift, or receiving an empty package. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  CIGARETTE: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Cigars and Cigarettes"),
    body: i`At this time, Wish prohibits the sale of all types of cigars and cigarettes. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NOT_DESCRIBE_AVAILABLE_QUANTITY: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n(
      "name of infraction",
      "First Image / Title does not explicitly describe each available quantities",
    ),
    body: i`The first image and/or title only shows the largest available quantity. Please clearly advertise the various quantity of products being sold in this listing in order to make all available options clear and easy to identify for customers. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATEFUL_CORONAVIRUS_PRODUCTS: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Hateful Coronavirus Products"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  INJECTABLE_ITEMS: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Injectable Items"),
    body: i`At this time, Wish prohibits the sale of injectable items. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CONTAINS_HARMFUL_CONTENT: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of infraction", "Contains Harmful Content"),
    body: i`Products that contain (or listings referencing) toxic or harmful, hazardous, dangerous, or prohibited metals, substances, and/or chemicals are prohibited on Wish. This product may not be relisted.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SIZE_COLOR_OPTION_GAMING: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of infraction", "Size / Color Option Gaming"),
    body: i`The drop-down options for size or color includes unrealistic options. Based on the size and color options provided, it is unclear what product is being sold. Please make all available drop-down options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATE_GROUPS: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "Hate Groups"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  QANON_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of infraction", "QAnon Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SURPRISE_BOX: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of infraction", "Surprise Boxes"),
    body: i`At this time, Wish does not permit the sale of surprise boxes, mystery gifts, or shipping random products without a choice. This product may not be relisted.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CUSTOMER_FEEDBACK_ABOUT_FALSE_SPEC: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Customer Feedback About False Spec"),
    body: i`Listings and/or product variations advertising devices with false, exaggerated, unreasonable, or impossible capacities/specifications (e.g., the sale of storage devices with false or impossible capacities) are prohibited on Wish. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  BUTANE: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Butane"),
    body: i`At this time, Wish prohibits the sale of Butane. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PURCHANSED_FOLLOWERS: {
    parent: "VIRTUAL_GOODS",
    title: ci18n("name of infraction", "Purchased Social Media Followers"),
    body: i`All goods sold on Wish must be tangible products. The sale of social media boosts or follower packages is not permitted. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MISSING_KEY_REQUIREMENTS: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of infraction", "Missing Key Requirements"),
    body: i`Products and/or listings must comply with all applicable laws and regulations to the product being advertised. The title, description, price, size/color options, and images used to advertise a product should clearly and accurately reflect the product being sold. Products or listings that do not meet authentication requirements, and/or products or listings with false or fake documentation are not permitted on Wish. If such content is removed, the listing may be reactivated.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_SILENCERS: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Gun Silencers"),
    body: i`At this time, Wish prohibits of all silencers, suppressors, or other sound moderators (whether intended for firearms or other items).`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CONTACTS: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of infraction", "Contacts"),
    body: i`At this time, Wish prohibits the sale of contact lenses. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TITLE_IMAGE_MISMATCH: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Title and Main Image Discrepancy"),
    body: i`The title and/or main image of this listing does not accurately represent the product being sold. There is conflicting information between the title and main Image. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please correct both the title and main image and create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  COCKROACH_CHALK: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of infraction", "Cockroach Chalk"),
    body: i`At this time, Wish prohibits the sale of products intended to kill or repel cockroaches (including cockroach chalk, powder and gel). This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HOOKAH_PEN: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "Hookah Pens"),
    body: i`At this time, Wish prohibits the sale of hook pens and/or its variants. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VAPE_LIQUID: {
    parent: "SMOKING",
    title: ci18n("name of infraction", "E-Juice / E-Liquid / Vape Liquid"),
    body: i`At this time, Wish prohibits the sale of e-juice, e-liquid, vape liquid, and/or its variants. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DANGEROUS_CPA_VIOLATION: {
    parent: "DANGEROUS_ITEMS",
    title: ci18n("name of infraction", "CPA Takedown"),
    body: i`Wish does not permit the sale of products which may potentially or actually be dangerous or unsafe to consumers, their property, and/or that may violate safety standards, laws, or regulations. This product may not be relisted.`,
    policy: i`[Dangerous and Unsafe Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/46"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  AMMUNITION: {
    parent: "WEAPON",
    title: ci18n("name of infraction", "Ammunition"),
    body: i`At this time, Wish prohibits the sale of Ammunition. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MISLEADING_KEY_FEATURE: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of infraction", "Missing Key Feature"),
    body: i`Wish received written feedback indicating the product received was missing a key feature that the item was originally advertised with. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  // TODO [lliepert]: below are not included in the copy spreadsheet
  UNCENSORED_EROTIC_ANIME: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  PROHIBITED_CUSTOMS_CN: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  IMAGE_OR_TITLE_CHANGE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  VHS_TAPE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  VIDEO_GAME: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  EPA_EMMISIONS_DEFEAT_US: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  BLURRED_LOGOS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  ANIME_PRODUCTS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  NOT_FOCUS_MAIN_IMAGE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  GRADUAL_CHANGE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CN_PROHIBITED_PRODUCT_STUN_GUNS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  FULLY_EXPOSED_NIPPLE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  RECORDS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  HIDDEN_SEX_TOYS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  BRANDING_CHANGE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  EROTIC_SETUPS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  EPA_PESTICIDES_US: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  BLUE_RAY: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  IMAGE_OF_MASTURBATION: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  DVD: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  BLURRED_WATERMARKS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  PESTICIDES: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  BLURRED_TAGS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CD: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  FULLY_EXPOSED_ANUS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  IMAGE_OF_PENETRATION: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CASSETTE_TAPE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CN_PROHIBITED_PRODUCT_TASERS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  FULLY_EXPOSED_GENITAL: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CN_PROHIBITED_PRODUCT_BB_GUNS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CN_PROHIBITED_PRODUCT_AIRSOFT: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  SOFTWARE: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  LASER_DISC: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  MISLEADING_WIG: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
  CN_PROHIBITED_PRODUCT_IMITATION_FIREARMS: {
    parent: "MISLEADING_LISTING",
    title: "",
    body: "",
    policy: "",
    faq: "",
  },
};

const CounterfeitReasonData: {
  readonly [reason in CounterfeitReason]: Omit<Datum, "policy" | "faq"> &
    Partial<Pick<Datum, "policy" | "faq">>; // policy and faq handled in the sub-reason lookup
} = {
  SAFETY_EQUIPMENT: {
    title: i`Safety Equipment`,
    body: i`This listing has been flagged for violating Wish's Policies on "Safety Equipment." For more information regarding our "Safety Equipment" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/38"}).`,
  },
  GRAPHIC_VIOLENCE: {
    title: i`Graphic Violence`,
    body: i`This listing has been flagged for violating Wish's Policies on "Graphic Violence." For more information regarding our "Graphic Violence" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/48"}).${"\n\n"}At this time, Wish prohibits the sale of products that depict graphic violence. This listing may be reactivated if such images are removed.`,
    policy: i`[Graphic Violence Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/48"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ILLEGAL_ELECTRONICS: {
    title: i`Privacy and Technology Violations`,
    body: i`This listing has been flagged for violating Wish's Policies on  "Privacy and Technology Violations." For more information regarding our "Privacy and Technology Violations" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/27"}).`,
  },
  ANIMAL_PRODUCTS: {
    title: i`Animal Products`,
    body: i`This listing has been flagged for violating Wish's Policies on "Animal Products." For more information regarding our "Animal Products" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/41"}).`,
  },
  FALSE_ADVERTISING: {
    title: i`False Advertising`,
    body: i`This listing has been flagged for violating Wish's Policies on "False Advertising." For more information regarding our "False Advertising" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/25"}).`,
  },
  RECALLED_TOYS: {
    title: i`Recalled Items`,
    body: i`This listing has been flagged for violating Wish's Policies on "Recalled Items." For more information regarding our "Recalled Items" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/18"}).`,
  },
  PLANTS_AND_SEEDS: {
    title: i`Plants and Plant Seeds`,
    body: i`This listing has been flagged for violating Wish's Policies on "Plants and Plant Seeds." For more information regarding our "Plants and Plant Seeds" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/44"}).`,
  },
  UNVERIFIED_MONEY: {
    title: i`Unverified and Counterfeit Currency`,
    body: i`This listing has been flagged for violating Wish's Policies on "Unverified and Counterfeit Currency." For more information regarding our "Unverified and Counterfeit Currency" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/39"}).`,
  },
  WEAPON: {
    title: i`Weapons`,
    body: i`This listing has been flagged for violating Wish's Policies on "Weapons." For more information regarding our "Weapons" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/7"}).`,
  },
  PRICE_GOUGING: {
    title: i`Price Gouging`,
    body: i`This listing has been flagged for violating Wish's Policies on "Price Gouging." For more information regarding our "Price Gouging" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/40"}).${"\n\n"}Product listings that are priced significantly higher than reasonable market value are not permitted on Wish. Please create a new listing that accurately represents the value of the product being sold.`,
    policy: i`[Price Gouging Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/40"})`,
    faq: i`[Coronavirus / COVID-19 Pandemic Price Gouging Policy FAQ](${zendeskURL(
      "mu1260802749270",
    )})`,
  },
  SMOKING: {
    title: i`Drugs and Drug Paraphernalia`,
    body: i`This listing has been flagged for violating Wish's Policies on "Drugs and Drug Paraphernalia." For more information regarding our "Drugs and Drug Paraphernalia" Policy, [click here]${"https://merchant.wish.com/policy/inappropriate-reasons/14"}.`,
  },
  MISLEADING_LISTING: {
    title: i`Misleading Listing`,
    body: i`This listing has been flagged for violating Wish's Policies on "Misleading Listings." For more information regarding our "Misleading Listings" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/33"}).`,
  },
  REGIONAL_RESTRICTIONS: {
    title: i`Regional Restrictions`,
    body: i`This product (and product listing) has been regionally restricted from sale (and offers for sale) in [geoblock country(s)]. Please do not list this product in the region(s) specified above because of one or more of the following product compliance reasons (without limitation): (a) missing regulatory labels and/or warnings; (b) failed, unverified, or lack of accredited lab testing or conformity assessment(s); (c) risk of physical injury or property damage; and/or (d) technical standards violation(s).${"\n\n"}If your product is not listed in the region(s) specified above you can ignore this infraction.${"\n\n"}For more information regarding regionally restricted products [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/42"}).`,
    policy: i`[Regional Restrictions Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/42"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NUDITY: {
    title: "",
    body: i`This listing has been flagged for violating Wish's Policies on "Graphic Sexual Content." For more information regarding our "Graphic Sexual Content" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/46"}).`,
  },
  HATE_CRIME: {
    title: i`Hateful Symbols & Messages`,
    body: i`This listing has been flagged for violating Wish's Policies on "Hateful Symbols and Messages." For more information regarding our "Hateful Symbols and Messages" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/23"}).`,
  },
  MEDICAL_MATERIALS: {
    title: i`Medically Regulated Materials`,
    body: i`This listing has been flagged for violating Wish's Policies on "Medically Regulated Materials." For more information regarding our "Medically Regulated Materials" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/34"}).`,
  },
  AMBIGUOUS_LISTING: {
    title: ci18n("title", "Ambiguous Listing"),
    body: i`This listing has been flagged for violating Wish's Policies on "Ambiguous Listings." For more information regarding our "Ambiguous Listings" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/28"}).`,
  },
  JEWELRY_AND_METALS: {
    title: i`Jewelry and Metals`,
    body: i`This listing has been flagged for violating Wish's Policies on "Jewelry." For more information regarding our "Jewelry" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/49"}).`,
  },
  CONSUMPTION_MATERIALS: {
    title: i`Materials for Consumption`,
    body: i`This listing has been flagged for violating Wish's Policies on "Materials for Consumption." For more information regarding our "Materials for Consumption" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/22"}).`,
  },
  HAZARDOUS_MATERIALS: {
    title: ci18n("title", "Hazardous Materials"),
    body: i`This listing has been flagged for violating Wish's Policies on "Hazardous Materials." For more information regarding our "Hazardous Materials" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/35"}).`,
  },
  DISTASTEFUL_CONTENT: {
    title: i`Distasteful Content`,
    body: i`This listing has been flagged for violating Wish's Policies on "Distasteful Content." For more information regarding our "Distasteful Content" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/47"}).${"\n\n"}At this time, Wish prohibits the sale of products that depict distasteful imagery. This listing may be reactivated if such images are removed.`,
    policy: i`[Distasteful Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/47"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DANGEROUS_ITEMS: {
    title: i`Dangerous and Unsafe Items`,
    body: i`This listing has been flagged for violating Wish's Policies on “Dangerous and Unsafe Items.” For more information regarding our “Dangerous and Unsafe Items” Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/46"}).`,
  },
  VIRTUAL_GOODS: {
    title: i`Virtual Goods`,
    body: i`This listing has been flagged for violating Wish's Policies on "Virtual Goods." For more information regarding our "Virtual Goods" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/21"}).`,
  },
  // TODO [lliepert]: below are not included in the copy spreadsheet
  UNLICENSED_MEDIA: {
    title: "",
    body: "",
  },
  LIGHTERS: {
    title: "",
    body: "",
  },
  PROP_MONEY: {
    title: "",
    body: "",
  },
  BLURRED_WATERMARK: {
    title: "",
    body: "",
  },
  WISH_ADMIN: {
    title: "",
    body: "",
  },
  HARMFUL_CHEMICALS: {
    title: "",
    body: "",
  },
  CN_PROHIBITED_PRODUCTS: {
    title: "",
    body: "",
  },
  CARSEAT: {
    title: "",
    body: "",
  },
  TEAM_LOGO: {
    title: "",
    body: "",
  },
  PICTURED_WITH_MAJOR_BRAND: {
    title: "",
    body: "",
  },
  PIERCING_GUN: {
    title: "",
    body: "",
  },
  ADULT_CONTENT: {
    title: "",
    body: "",
  },
  PRODUCT_MODIFIED: {
    title: "",
    body: "",
  },
  CENSORED_FACE: {
    title: "",
    body: "",
  },
  BLURRED_LABEL: {
    title: "",
    body: "",
  },
  HOVERBOARD: {
    title: "",
    body: "",
  },
  CELEBRITY_PHOTO: {
    title: "",
    body: "",
  },
  TRICK_CANDLES: {
    title: "",
    body: "",
  },
  BLURRED_INFORMATION: {
    title: "",
    body: "",
  },
  IS_MAJOR_BRAND: {
    title: "",
    body: "",
  },
  HARNESS: {
    title: "",
    body: "",
  },
  TATTOO_GUN: {
    title: "",
    body: "",
  },
  MISLEADING_LISTING_AUTHENTIC_BRAND: {
    title: "",
    body: "",
  },
  CONTACT_LENSES: {
    title: "",
    body: "",
  },
  BIKE_HELMETS: {
    title: "",
    body: "",
  },
  PLANT_SEEDS: {
    title: "",
    body: "",
  },
};

const MerchantWarningReasonData: {
  readonly [reason in MerchantWarningReason]: Datum;
} = {
  REQUEST_USER_EMAIL: {
    title: i`Requesting Customer's Personal Information`,
    body: i`You asked a customer for their personal information, i.e.: email address, payment information, etc.`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  REQUEST_MONEY: {
    title: i`Requesting Customer Payment Outside Wish`,
    body: i`You asked a customer for payment outside of Wish, or requested a direct payment from a customer`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  BAD_CUSTOMER_SERVICE: {
    title: i`Discourteous Customer Service`,
    body: i`Wish customers expect timely, courteous, and effective support`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  DISINGENUOUS_CUSTOMER_SERVICE: {
    title: i`Disingenuous Customer Service`,
    body: i`Wish has found that you have been disingenuous to customers`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  TAKE_USER_OUTSIDE_WISH: {
    title: i`Directing Customers Off of Wish`,
    body: i`You asked customers to visit stores outside of Wish, or generally redirected customers off Wish`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: undefined,
  },
  VIOLATE_POLICY: {
    title: i`Policy Violation`,
    body: i`You have violated [Wish Merchant Policies](${"https://merchant.wish.com/policy"})`,
    policy: undefined,
    faq: undefined,
  },
  FINE_FOR_COUNTERFEIT_GOODS: {
    title: i`Intellectual Property Violation`,
    body: i`This product is counterfeit or infringes on another entity's [IP](${"https://www.wish.com/intellectual-property?hide_login_modal=true"})`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[How to Avoid Intellectual Property Violations](${zendeskURL(
      "1260801319309",
    )})`,
  },
  PRODUCT_HIGH_REFUND_RATIO: {
    title: i`High Product Quality Refund Rate`,
    body: i`This product has a refund rate of more than ${5}% and/or an extremely low average rating`,
    policy: i`[Returns Policy](${"https://merchant.wish.com/policy#returns"})`,
    faq: undefined,
  },
  FINE_PRODUCT_SWAPPED: {
    title: i`Material Listing Change`,
    body: i`Changes to this listing (e.g., product name, description, images) misrepresent the product, set false customer expectations, and/or don't comply with Wish Merchant Policies`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  SUSPECTED_FRAUD: {
    title: i`Suspected Fraud`,
    body: i`Wish has found that your account violated our Terms of Service](${"https://www.wish.com/en-terms"}) with deceptive, fraudulent, or illegal activity`,
    policy: i`[Terms of Service](${"https://merchant.wish.com/terms-of-service"})`,
    faq: undefined,
  },
  REPEAT_IP_INFRINGEMENT_ON_BRAND_OWNER: {
    title: i`Repeat Intellectual Property Infringement`,
    body: i`Wish has found that you sell products that infringe on another entity's IP`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[Intellectual Property Violations FAQ](${zendeskURL(
      "1260801319309",
    )})`,
  },
  MERCHANT_CONTACT_INFO_INVALID: {
    title: i`Invalid Contact Information`,
    body: i`Your contact information is missing or inaccurate`,
    policy: i`[Registration Policy](${"https://merchant.wish.com/policy"})`,
    faq: undefined,
  },
  LEGAL_TRO_TAKEDOWN: {
    title: i`Intellectual Property Violation`,
    body: i`You have received a Temporary Restraining Order as the result of a lawsuit from the entity that owns a product's IP. [Learn more about TROs.](${zendeskURL(
      "360008058353",
    )})`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[Temporary Restraining Order FAQ](${zendeskURL("360008058353")})`,
  },
  MISLEADING_VARIATION: {
    title: i`Misleading Product Variations`,
    body: i`This listing contains product variations that substantially differ from one another`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: i`[Misleading Listings FAQ](${zendeskURL("360003237193")})`,
  },
  WISHPOST_NEGATIVE_BALANCE: {
    title: i`WishPost Negative Balance`,
    body: i`Wish will withhold your WishPost payments due to a current negative balance`,
    policy: undefined,
    faq: undefined,
  },
  HIGH_IP_INFRINGEMENT: {
    title: i`Suspension - Repeat Intellectual Property Infringements`,
    body: i`Wish has suspended your account due to multiple IP infringements`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: undefined,
  },
  CN_PROHIBITED_PRODUCTS: {
    title: i`Prohibited Product Imported/Exported From China`,
    body: i`This product does not comply with China Customs Policy for import and/or export from China`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  STRIKE_BASED_HIGH_RISK_PROHIBITED: {
    title: i`High Risk Prohibited Product`,
    body: i`This listing contains a product prohibited from sale on Wish. [View prohibited products list](${"https://merchant.wish.com/policy/inappropriate-reasons/1"})`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  PRODUCT_GEOBLOCK: {
    title: i`Regionally Restricted Product Listing`,
    body: i`This product appears available for sale in a region where it is prohibited`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: i`[Regional Requirements FAQ](${zendeskSectionURL("4411071551259")})`,
  },
  WAREHOUSE_FULFILLMENT_POLICY_VIOLATION: {
    title: i`Order Delivered Later Than Set Max Delivery Days`,
    body: i`This order is confirmed delivered late per your max delivery days setting`,
    policy: i`[Warehouse Fulfillment Policy](${"https://merchant.wish.com/policy#warehouse_fulfillment"})`,
    faq: undefined,
  },
  BRANDED_PRODUCT_GEOBLOCK: {
    title: i`Intellectual Property Violation - Regionally Restricted Listing`,
    body: i`This product may be counterfeit, or its sale infringes on an entity's IP in a region where they have rights to it`,
    policy: i`[Intellectual Property Policy](${"https://merchant.wish.com/policy#ip"})`,
    faq: i`[Regional Requirements FAQ](${zendeskSectionURL("4411071551259")})`,
  },
  FAKE_TRACKING: {
    title: i`Misleading Tracking Number`,
    body: i`The tracking number on this order is inaccurate`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  MERCHANT_CANCELLATION_VIOLATION: {
    title: i`Cancelled Order`,
    body: i`You cancelled or refunded this order prior to confirmed fulfillment`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  LATE_CONFIRMED_FULFILLMENT_VIOLATION: {
    title: i`Late Confirmed Fulfillment`,
    body: i`This order was not confirmed fulfilled by the carrier within ${7} days (for an order less than $100) or ${14} days (for an order greater than or equal to $100)`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  UNFULFILLED_ORDER: {
    title: i`Unfulfilled Order`,
    body: i`You did not fulfill the order within ${5} calendar days`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  INACTIVE_ACCOUNT: {
    title: i`Inactive Account`,
    body: i`Wish has detected that your account has been [inactive](${"https://merchantfaq.wish.com/hc/en-us/articles/9358114053787-Inactive-account-infractions"} for some time`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: i`[Inactive Account Infractions FAQ](${zendeskURL("9358114053787")})`,
  },
  ORDER_NOT_DELIVERED: {
    title: i`Order Not Delivered`,
    body: i`"Based on confirmed tracking information, this order did not arrive before (max TTD + ${7} days).
      Note: Wish will automatically reverse this infraction if the order is confirmed delivered or gets paid out."`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  //
  // below data should never be used, data should be overwritten with the reason+subreason
  // specific data. exists only for TS validation
  //
  PRODUCT_IS_INAPPROPRIATE: {
    title: i`Prohibited Content`,
    body: i`"This product listing contains [prohibited content](${zendeskURL(
      "205211777",
    )}) (e.g.: unacceptable images, titles, descriptions, etc.).`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  //
  // below infractions are deprecated, may be returned when viewing old infractions
  //
  REUPLOADING_COUNTERFEITS: deprecatedInfractionData,
  PRODUCT_LOW_RATING_NO_REMOVE: deprecatedInfractionData,
  VIOLATION_OF_TERMS: deprecatedInfractionData,
  STORE_VALIDATION_INCOMPLETE: deprecatedInfractionData,
  TAX_SETTING_NOT_UPDATED: deprecatedInfractionData,
  MERCHANT_HARASSMENT: deprecatedInfractionData,
  COUNTERFEIT_GOODS: deprecatedInfractionData,
  CS_LOW_CSAT_SCORE: deprecatedInfractionData,
  LATE_FULFILLMENT_RATE: deprecatedInfractionData,
  DECEPTIVE_FULFILLMENT: deprecatedInfractionData,
  REPEAT_PRODUCT_SWAPPING: deprecatedInfractionData,
  WISHPOST_ID_NOT_COMPLETE_FACE_RECOGNITION: deprecatedInfractionData,
  HIGH_GMV_FROM_MISLEADING_PRODUCTS: deprecatedInfractionData,
  PRODUCT_HIGH_CANCEL_ORDER_RATE: deprecatedInfractionData,
  BAN_EARLY_STAGE_MERCHANT: deprecatedInfractionData,
  HIGH_REFUND_RATIO: deprecatedInfractionData,
  POLICY_TIER_DEMOTION: deprecatedInfractionData,
  MERCHANT_HIGH_QUALITY_REFUND_RATIO: deprecatedInfractionData,
  US_TAX_INFO_UNVALIDATED: deprecatedInfractionData,
  PENALTY_FOR_AUTO_REFUND: deprecatedInfractionData,
  FINAL_JUDGEMENT_ORDER: deprecatedInfractionData,
  CONFIRMED_DELIVERY_POLICY: deprecatedInfractionData,
  UNCONFIRMED_TRACKING_NUMBERS: deprecatedInfractionData,
  FINE_WISH_EXPRESS_POLICY_VIOLATION: deprecatedInfractionData,
  PRODUCT_HIGH_REFUND_RATIO_NO_REMOVE: deprecatedInfractionData,
  RESPOND_TO_ADMIN: deprecatedInfractionData,
  WISH_EXPRESS_POLICY_PRODUCT: deprecatedInfractionData,
  PRODUCT_HIGH_QUALITY_REFUND_RATIO: deprecatedInfractionData,
  MERCHANT_HIGH_REFUND_EAT_COST: deprecatedInfractionData,
  DEP_FINE_DISABLE_PROMOTED_PRODUCT: deprecatedInfractionData,
  CS_LATE_RESPONSE_RATE: deprecatedInfractionData,
  WISH_EXPRESS_POLICY_VIOLATION: deprecatedInfractionData,
  HIGH_AUTO_REFUND: deprecatedInfractionData,
  MERCHANT_HIGH_CANCEL_ORDER_RATE: deprecatedInfractionData,
  HIGH_GMV_FROM_GAMING_FREEZE: deprecatedInfractionData,
  WISH_EXPRESS_POLICY_MERCHANT: deprecatedInfractionData,
  EMPTY_PACKAGES: deprecatedInfractionData,
  VIOLATION_OF_POLICY_TIER: deprecatedInfractionData,
  PRODUCT_LOW_RATING: deprecatedInfractionData,
  FINE_UPDATE_TO_COUNTERFEIT: deprecatedInfractionData,
  RELATED_ACCOUNT_IS_BANNED: deprecatedInfractionData,
  DEP_FINE_DISABLE_PROMOTED_PRODUCT_FOR_COUNTRY: deprecatedInfractionData,
  DUPLICATE_ACCOUNTS: deprecatedInfractionData,
  EXTREMELY_HIGH_PRICE_SPREAD: deprecatedInfractionData,
  HIGH_GMV_FROM_GAMING_BAN: deprecatedInfractionData,
  HIGH_CHARGEBACK_AND_FRAUD_REFUND_RATIO: deprecatedInfractionData,
  HIGH_GMV_FROM_GAMING_AUDIT: deprecatedInfractionData,
  INVALID_EU_RESPONSIBLE_PERSON: deprecatedInfractionData,
  FAKE_RATING: deprecatedInfractionData,
  DEP_BAIT_VARIABLE_PRICING: deprecatedInfractionData,
  INVALID_TRACKING_NUMBERS: deprecatedInfractionData,
  HIGH_CHARGEBACK_RATIO: deprecatedInfractionData,
  VIOLATE_TS_POLICY: deprecatedInfractionData,
  DUPLICATE_PRODUCTS: deprecatedInfractionData,
};

export const CommerceTransactionStateDisplayText: {
  readonly [state in CommerceTransactionState]: string;
} = {
  APPROVED: ci18n(
    "a label showing a merchant the status of an order, this order is ready to be shipped",
    "Ready to be shipped",
  ),
  SHIPPED: ci18n(
    "a label showing a merchant the status of an order, this order has been shipped",
    "Shipped",
  ),
  REFUNDED: ci18n(
    "a label showing a merchant the status of an order, this order has been refunded",
    "Refunded",
  ),
  REQUIRE_REVIEW: ci18n(
    "a label showing a merchant the status of an order, this order is under review",
    "Under Review",
  ),
  EXCEPTION: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  LABEL_GENERATED: ci18n(
    "a label showing a merchant the status of an order, this order's shipping label has been generated",
    "Shipping label generated",
  ),
  LABEL_DOWNLOADED: ci18n(
    "a label showing a merchant the status of an order, this order's shipping label has been downloaded",
    "Shipping label downloaded",
  ),
  DELAYING: ci18n(
    "a label showing a merchant the status of an order, this order is being delayed",
    "Delaying",
  ),
  PENDING: ci18n(
    "a label showing a merchant the status of an order, payment is pending for this order",
    "Payment Pending",
  ),
  DECLINED: ci18n(
    "a label showing a merchant the status of an order, payment has been declined for this order",
    "Payment Declined",
  ),
  //
  // below states are deprecated and should not be returned
  //
  ACKNOWLEDGED: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  GIFT_WAITING_FOR_ACCEPT: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  C2C_ACCEPTED: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  C2C_DELIVERED: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
  C2C_ON_DELIVERY: ci18n(
    "a label showing a merchant the status of an order, an error has occurred with the order",
    "Error",
  ),
};

export type DisputeStatus =
  | TrackingDisputeState
  | MerchantWarningProofDisputeStatus;

export const DisputeStatusDisplayText: {
  readonly [state in DisputeStatus]: string;
} = {
  AWAITING_ADMIN: ci18n(
    "a label showing a merchant the status of a dispute",
    "Awaiting Admin",
  ),
  CANCELLED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Cancelled",
  ),
  AWAITING_MERCHANT: ci18n(
    "a label showing a merchant the status of a dispute",
    "Awaiting Merchant",
  ),
  APPROVED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Approved",
  ),
  DECLINED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Declined",
  ),
  DISPUTING: ci18n(
    "a label showing a merchant the status of a dispute",
    "Disputing",
  ),
  DISPUTE_FAILED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Dispute Failed",
  ),
  NOT_DISPUTED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Not Disputed",
  ),
  DISPUTE_SUCCESS: ci18n(
    "a label showing a merchant the status of a dispute",
    "Dispute Success",
  ),
};

export const MerchantWarningImpactTypeDisplayText: {
  readonly [impact in MerchantWarningImpactType]: (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => string;
} = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  PRODUCT_PAYMENT_HOLD: (startDate, endDate) => "TODO",
  ORDER_PAYMENT_HOLD: (startDate, endDate) => "TODO",
  AUTO_REFUND: (startDate, endDate) =>
    i`Wish refunded this order on ${startDate}.`,
  MERCHANT_IMPRESSION_BLOCK: (startDate, endDate) => "TODO",
  MERCHANT_PAYMENT_HOLD: (startDate, endDate) => "TODO",
  PRODUCT_TAKEDOWN: (startDate, endDate) =>
    i`Wish removed this product listing on ${startDate}.`,
  EAT_COST_FOR_PRODUCT: (startDate, endDate) => "TODO",
  PRODUCT_IMPRESSION_BLOCK: (startDate, endDate) =>
    i`Wish will block impressions for you account until ${endDate}.`,
  VARIATION_TAKEDOWN: (startDate, endDate) =>
    i`Wish removed this variation on ${startDate}.`,
  /* eslint-enable @typescript-eslint/no-unused-vars */
};

export const MerchantWarningStateDisplayText: {
  readonly [state in MerchantWarningState]: string;
} = {
  AWAITING_AUTH_TAGGING_HIGH_GMV: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  US_BD_REVIEW_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  CN_BD_REVIEW_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  REQUEST_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  AWAITING_ADMIN: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  REQUIRES_ADMIN_REVIEW: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  AWAITING_ADMIN_BOT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  CLOSED: ci18n(
    "a label showing a merchant the state of an infraction",
    "Closed",
  ),
  CANCELLED: ci18n(
    "a label showing a merchant the state of an infraction",
    "Cancelled",
  ),
  NEW: ci18n("a label showing a merchant the state of an infraction", "New"),
  AWAITING_MERCHANT: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
  AWAITING_AUTH_TAGGING_LOW_GMV: ci18n(
    "a label showing a merchant the state of an infraction",
    "TODO",
  ),
};

export const MerchantWarningProofTypeDisplayText: {
  readonly [type in MerchantWarningProofType]: string;
} = {
  MERCHANT: ci18n("a type of evidence for an infraction", "Merchant"),
  PRODUCT: ci18n("a type of evidence for an infraction", "Product"),
  VARIATION: ci18n("a type of evidence for an infraction", "Variation"),
  PRODUCT_RATING: ci18n(
    "a type of evidence for an infraction",
    "Product Rating",
  ),
  TICKET: ci18n("a type of evidence for an infraction", "Ticket"),
  ORDER: ci18n("a type of evidence for an infraction", "Order"),
};

export const getInfractionData = (
  reason: MerchantWarningReason,
  inappropriateReason: CounterfeitReason | undefined,
  inappropriateSubreason: TaggingViolationSubReasonCode | undefined,
): Datum =>
  reason === "PRODUCT_IS_INAPPROPRIATE" &&
  inappropriateReason != null &&
  inappropriateSubreason == null
    ? {
        title: CounterfeitReasonData[inappropriateReason].title,
        body: CounterfeitReasonData[inappropriateReason].body,
        policy: CounterfeitReasonData[inappropriateReason].policy,
        faq: CounterfeitReasonData[inappropriateReason].faq,
      }
    : inappropriateReason != null && inappropriateSubreason != null
    ? {
        title: `${CounterfeitReasonData[inappropriateReason].title} - ${TaggingViolationSubReasonCodeData[inappropriateSubreason].title}`,
        body: `${CounterfeitReasonData[inappropriateReason].body}${"\n\n"}${
          TaggingViolationSubReasonCodeData[inappropriateSubreason].body
        }`,
        policy:
          TaggingViolationSubReasonCodeData[inappropriateSubreason].policy,
        faq: TaggingViolationSubReasonCodeData[inappropriateSubreason].faq,
      }
    : MerchantWarningReasonData[reason];
