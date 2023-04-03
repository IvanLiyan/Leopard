import { ci18n } from "@core/toolkit/i18n";
import { zendeskSectionURL, zendeskURL } from "@core/toolkit/url";
import {
  CommerceTransactionState,
  CounterfeitReason,
  MerchantWarningImpactType,
  MerchantWarningProofDisputeStatus,
  MerchantWarningReason,
  MerchantWarningState,
  TaggingViolationSubReasonCode,
  TrackingDisputeState,
} from "@schema";
import { InfractionEvidenceType } from "./components/cards/InfractionEvidenceCard";

type Copy = {
  readonly title: string;
  readonly body: string;
  readonly policy: string | undefined;
  readonly faq: string | undefined;
};

const getDeprecatedInfractionData = (title: string): Copy => ({
  title,
  body: i`Wish has deprecated this infraction, which means you cannot receive it again moving forward. However, this infraction may still impact your account.`,
  policy: undefined,
  faq: undefined,
});

const TaggingViolationSubReasonCodeData: {
  readonly [reason in TaggingViolationSubReasonCode]: Partial<Copy> & {
    readonly parent: CounterfeitReason;
  };
} = {
  BRAND_DISCREPANCY: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Brand Discrepancy"),
    body: i`Wish received written feedback indicating the product received was not the brand of the item being advertised in the listing. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold. [Learn more](${"https://merchant.wish.com/policy/inappropriate-reasons/33"}).`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  CONFEDERATE_FLAG: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Confederate Flag"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RECREATIONAL_DRUGS_AND_CHEMICALS: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Recreational Drugs and Chemicals"),
    body: i`At this time, Wish prohibits the sale of all recreational drugs, research chemicals, party drugs, and controlled substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SUBSCRIPTIONS_OR_MEMBERSHIPS: {
    parent: "VIRTUAL_GOODS",
    title: ci18n(
      "name of warning",
      "Subscriptions to Channels, Websites, or Other Memberships",
    ),
    body: i`All goods sold on Wish must be tangible products. The sale of subscriptions to television channels, websites, or other memberships is not permitted. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DOMESTIC_TERRORISTS_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Domestic Terrorists Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HYPERREALISTIC_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Hyperrealistic Content"),
    body: i`Wish does not allow realistic sexual wellness products such as (but not limited to) life-like or flesh-like sex dolls and/or body parts. This product may not be relisted.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANT_SEED_WITH_IMPOSSIBLE_CLAIM: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of warning", "Plant Seeds with Impossible Claims"),
    body: i`The images and/or description for these plant seeds make impossible claims. Misuse of images and other listing elements to falsely promote a product is not permitted.This listing may be reactivated if such images or references are removed.`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DANGEROUS_NON_CPA_VIOLATION: {
    parent: "DANGEROUS_ITEMS",
    title: ci18n("name of warning", "Non-CPA Takedown"),
    body: i`Wish does not permit the sale of products which may potentially or actually be dangerous or unsafe to consumers, their property, and/or that may violate safety standards, laws, or regulations. This product may not be relisted.`,
    policy: i`[Dangerous and Unsafe Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/46"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PRODUCT_VARIANCE: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of warning", "Product Variance"),
    body: i`There are multiple products being sold in this product listing. Please make all available options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PRESCRIPTION_STRENGTH_ITEMS: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Prescription Strength Items"),
    body: i`At this time, Wish prohibits the sale of prescription strength items. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NOT_FOCUS_OF_MAIN_IMAGE: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "Product is not the focus of the main image",
    ),
    body: i`The first image in this listing does not clearly show the product being sold.  The product being sold occupies 25% or less of the main image and is utilized in relation to another product that is not for sale. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  REVIEW_SHOW_WRONG_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "Customer Feedback About Different Product",
    ),
    body: i`The product reviews from our customers indicate the product received was fundamentally different (e.g., serves a different function, product is an entirely different category of product or looks completely different) than the item being advertised. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  SPY_CAMERAS: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n(
      "name of warning",
      "Spy Cameras with Sexually Exploitive Surveillance Images",
    ),
    body: i`At this time, Wish prohibits the sale of surveillance equipment sold with the explicit intention of sexual or illicit purposes. This product may be relisted if such images are removed.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TERRORIST_PROMOTION_GROUPS: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Terrorist Promotion Groups"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  EURO_CURRENCY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n("name of warning", "Euro Currency"),
    body: i`At this time, Wish prohibits the sale of euro currency. This product may not be relisted.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ASSAULT_WEAPON_CONVERSION_PIECES: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Assault Weapon Conversion Pieces"),
    body: i`At this time, Wish prohibits the sale of all firearm parts and accessories used to convert the machine into an assault weapon. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SIZE_MISREPRESENTATION_MAIN_IMAGE: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "Size Misrepresentation (Product Image Only)",
    ),
    body: i`The images showcase the product size to be much larger than what is actually being sold in this listing. Please make sure all photos of this listing represent the product actually being sold and do not create a false impression or confusion for your customers. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  SIZE_NOT_AS_ADVERTISED: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Description & Size Not as Advertised"),
    body: i`The description and/or package size does not reflect the same product as the title and/or images. Please update the title and/or images and create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  SEXUALLY_SUGGESTIVE_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Sexually Suggestive Content"),
    body: i`Wish does not allow listings that include sexually suggestive content in the title, images, and/or description. If such content is removed, the listing may be reactivated.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  LISTING_PROMOTES_HIDING_PROHIBITED_SUBSTANCE: {
    parent: "SMOKING",
    title: ci18n(
      "name of warning",
      "Listing Promotes Hiding Prohibited Substance",
    ),
    body: i`At this time, Wish prohibits the sale of products that promote the concealment of prohibited substances. If such content is removed, the listing may be reactivated.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PENICILLIN: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Penicillin"),
    body: i`At this time, Wish prohibits the sale of penicillin. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RATING_SHOW_WRONG_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Customer Images Show Different Product"),
    body: i`The product review images from our customers indicate the product received was fundamentally different (e.g., serves a different function, product is an entirely different category of product, or looks completely different) than the item being advertised. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  UNREASONABLE_SPEC: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Unreasonable or Exaggerated Spec"),
    body: i`Listings and/or product variations advertising devices with false, exaggerated, unreasonable, or impossible capacities/specifications are prohibited on Wish. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  HUMAN_GROWTH_HORMONE: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Human Growth Hormone"),
    body: i`At this time, Wish prohibits the sale of human growth hormone. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEATBELTS: {
    parent: "SAFETY_EQUIPMENT",
    title: ci18n("name of warning", "Seatbelts & Seatbelt Extenders"),
    body: i`The sale of seatbelts and seatbelt extenders is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Safety Equipment Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/38"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FULLY_LOADED_TV_BOXES: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n("name of warning", "Fully Loaded TV Boxes"),
    body: i`At this time, Wish prohibits the sale of media streaming devices that provide unauthorized access to content. This product may not be relisted.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_SILENCER_COMPONENTS: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Gun Silencer Components"),
    body: i`At this time, Wish prohibits the sale of any material component/parts that can be used to build a silencer or attach a silencer to a firearm. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  LIVE_ANIMAL: {
    parent: "ANIMAL_PRODUCTS",
    title: ci18n("name of warning", "Living Animals"),
    body: i`At this time, Wish prohibits the sale of live animals. This product may not be relisted.`,
    policy: i`[Animal Products Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/41"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERIFIED_WARRANTIES: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Unverified Warranties"),
    body: i`At this time, Wish prohibits listings containing unverified warranties or guarantees. The sale of verified warranties is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ALCOHOL: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of warning", "Alcohol"),
    body: i`At this time, Wish prohibits the sale of alcohol. This product may not be relisted.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TOBACCO: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Tobacco"),
    body: i`At this time, Wish prohibits the sale of tobacco and/or products that contain tobacco. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SIZE_MISPRESENTATION: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "Size Misrepresentation (Product Image Only)",
    ),
    body: i`The images showcase the product size to be much larger than what is actually being sold in this listing. Please make sure all photos of this listing represent the product actually being sold and do not create a false impression or confusion for your customers. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  POPPERS_AND_MUSCLE_RELAXANTS: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Poppers and Muscle Relaxants"),
    body: i`At this time, Wish prohibits the sale of poppers and other recreational muscle relaxant drugs. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATEFUL_IMAGERY: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Hateful Imagery"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNREALISTIC_HEALTH_CLAIM_PRODUCTS: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Unrealistic Health Claims"),
    body: i`Products or listings which advertise, promote, allude to, and/or depict any results for health and health-related, or personal care products without adequate substantiation are not permitted on Wish. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_SILENCER_MISUSE: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Gun Silencer Misuse"),
    body: i`At this time, Wish prohibits the sale of any item intended for use as a silencer or commonly misused as a silencer. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SELF_FEEDING_BABY_PILLOWS: {
    parent: "RECALLED_TOYS",
    title: ci18n("name of warning", "Self Feeding Baby Pillows"),
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
    title: ci18n("name of warning", "Real, Metal Ninja Stars (Throwing Stars)"),
    body: i`At this time, Wish prohibits the sale of all throwing stars. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HOUSEKEEPING_TOUR_PACKAGES: {
    parent: "VIRTUAL_GOODS",
    title: ci18n(
      "name of warning",
      "Housekeeping, Tour Packages, or Other Services",
    ),
    body: i`All goods sold on Wish must be tangible products. At this time, Wish prohibits the sale of housekeeping, tour packages, or other services. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERIFIED_LOGO: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Unverified Logos from Credible Agencies"),
    body: i`At this time, Wish prohibits listings containing unverified logos from credible agencies. This listing may be reactivated if such images or references are removed.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RANDOM_PRODUCT: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of warning", "Random / Undefined Product"),
    body: i`Listing titles, images, price points, size/color options, style variations, and descriptions should all align with the product being sold. Please make all available options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NUDE_MINOR_IN_NON_SEXUAL_CONTEXT: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Nude Minor in Non-Sexual Context"),
    body: i`Listings which contain images of a nude minor (including partial nudity) are not permitted on Wish. The listing may be reactivated if such images are removed.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MERCAHNT_CONTACT_OR_REFERAL: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Merchant Contact or Referral Information"),
    body: i`At this time, Wish prohibits listings containing merchant contact or referral information. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  RACIAL_CLEANSING: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Racial Cleansing"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANTS: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of warning", "Plants"),
    body: i`The sale of plants is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VITAMINS_AND_SUPPLEMENTS: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of warning", "Vitamins & Supplements"),
    body: i`The sale of vitamins and supplements is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FOOD: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of warning", "Food"),
    body: i`The sale of food is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NON_CLINICAL_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Non-Clinical Content"),
    body: i`Wish does not allow sexual wellness product listings where the product is not the primary focus of the image. Sexual wellness product listings must include images that clearly depict the product for sale against a white or transparent backdrop and/or be free of blurring or censoring. To reactivate this listing, ensure all images comply with Wish Policies.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ENDANGERED_SPECIES: {
    parent: "ANIMAL_PRODUCTS",
    title: ci18n("name of warning", "Endangered Species"),
    body: i`At this time, Wish prohibits the sale of any animal (live or deceased) that is a threatened or endangered species and/or products containing or made from endangered species or their parts. This product may not be relisted.`,
    policy: i`[Animal Products Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/41"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MOD_BOXES: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Mod Boxes"),
    body: i`At this time, Wish prohibits the sale of Mod Boxes and/or any other electrical accessories used for the consumption of smokable substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNSUPPORTED_MEDICAL_CLAIMS: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Unsupported Medical Claims"),
    body: i`The listing advertises the use of unsupported medical claims and/or images that set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  BULLYING: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Bullying"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEXUALLY_EXPLICIT_CONTENT: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Sexually Explicit Content"),
    body: i`Wish does not allow listings that include sexually explicit content in the title, images, and/or description. If such content is removed, the listing may be reactivated.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  OTC_MEDICATION: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "OTC Medication"),
    body: i`The sale of over the counter medication is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HOVERBOARDS: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Hoverboards"),
    body: i`At this time, Wish prohibits the sale of Hoverboards. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  BENZENE: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Products that contain Benzene"),
    body: i`At this time, Wish prohibits the sale of Benzene and/or any product containing Benzene. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HUMAN_BY_PRODUCTS: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Human By-Products"),
    body: i`At this time, Wish prohibits the sale of human by-products. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  COUNTERFEIT_CURRENCY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n("name of warning", "CPA: Counterfeit Currency"),
    body: i`At this time, Wish prohibits the sale of counterfeit currency. This product may not be relisted.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VIRTUAL_MONEY: {
    parent: "VIRTUAL_GOODS",
    title: ci18n("name of warning", "Virtual Money for Online Games"),
    body: i`All goods sold on Wish must be tangible products. The sale of virtual money or other digital goods is not permitted. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MARIJUANA: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Marijuana / Cannabis"),
    body: i`At this time, Wish prohibits the sale of marijuana, cannabis, and CBD in all forms. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TIRE_SPIKES: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Tire Spikes"),
    body: i`At this time, Wish prohibits the sale of Tire Spikes. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PET_FOOD: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of warning", "Pet Food"),
    body: i`The sale of pet food is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ECIGARETTE_VAPE: {
    parent: "SMOKING",
    title: ci18n("name of warning", "E-cigarettes / Vape Pens"),
    body: i`At this time, Wish prohibits the sale of e-cigarettes, vape pens, and any other electrical accessories used for the consumption of smokable substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CHLOROFORM: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Chloroform"),
    body: i`At this time, Wish prohibits the sale of chloroform. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ANTI_GAY: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Anti-gay"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERFIED_PRICE_INFORMATION: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Unverified Price Information"),
    body: i`This listing contains inconsistencies in the product price and falls outside verifiable market rates. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL("mu360005950894")})`,
  },
  TOBACCO_SEEDS: {
    parent: "SMOKING",
    title: ci18n(
      "name of warning",
      "Tobacco / Marijuana / Cannabis / Hemp Seeds",
    ),
    body: i`At this time, Wish prohibits the sale of tobacco, marijuana, cannabis, hemp seeds, and/or products that appear to contain such substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PROHIBITED_SUBSTANCE_PIPE: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Prohibited Substance Pipe"),
    body: i`At this time, Wish prohibits the sale of pipes that can be used to consume prohibited substances. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  COMPETITOR_WATERMARK: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Competitor Watermark"),
    body: i`At this time, the use of watermarks, logos, images, and links belonging to other marketplaces is not permitted. Referring users off of Wish is a direct violation of Wish's merchant policies. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ODOMETER_CORRECTION_TOOLS: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n("name of warning", "Odometer Correction Tools"),
    body: i`At this time, Wish prohibits the sale of odometer correction tools. This product may not be relisted.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PROUD_BOY_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Proud Boy Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CHILD_HARNESS: {
    parent: "SAFETY_EQUIPMENT",
    title: ci18n("name of warning", "Child Harness"),
    body: i`The sale of child harnesses is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Safety Equipment Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/38"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PILL_PRESSES: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Pill Presses"),
    body: i`At this time, Wish prohibits the sale of pill presses in all forms. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HITLER_IMAGERY: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Hitler Imagery"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  OTHER_WHITE_SUPREMACY_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Other White Supremacy Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SELF_FEEDING_BABY_BOTTLE_CLIPS: {
    parent: "RECALLED_TOYS",
    title: ci18n("name of warning", "Self Feeding Baby Bottle Clips"),
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
      "name of warning",
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
    title: ci18n("name of warning", "Nazi Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATE_SPEECH: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Hate Speech"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MAGNETS_AS_TOYS: {
    parent: "RECALLED_TOYS",
    title: ci18n(
      "name of warning",
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
    title: ci18n("name of warning", "Imitation Currency Not Properly Labeled"),
    body: i`At this time, Wish prohibits the sale of imitation currency that is absent of proper labeling. The product may be relisted if such content is properly labeled.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  EXPLOSIVE_WEAPONS: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Explosive Weapons"),
    body: i`At this time, Wish prohibits the sale of explosive and/or combustible weapons. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  US_PROP_MONEY: {
    parent: "UNVERIFIED_MONEY",
    title: ci18n("name of warning", "US Prop Money"),
    body: i`At this time, Wish prohibits the sale of US prop money. This product may not be relisted.`,
    policy: i`[Unverified and Counterfeit Currency Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/39"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PRICE_POINT_UNREASONABLE: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Price Point Unreasonable"),
    body: i`The price of this item is unreasonably low for the product being sold and is in direct violation of Wish's policies. Please create a new listing that accurately represents the value of the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  CONTACT_LENS_SOLUTION: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Contact Lens Solution"),
    body: i`At this time, Wish prohibits the sale of contact lens solution. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  KKK_PARAPHERNALIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "KKK Paraphernalia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  BEVERAGES: {
    parent: "CONSUMPTION_MATERIALS",
    title: ci18n("name of warning", "Beverages"),
    body: i`The sale of non-alcoholic beverages is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Materials for Consumption Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/36"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CPSC_VIOLATION: {
    parent: "RECALLED_TOYS",
    title: ci18n("name of warning", "CPA Violation"),
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
      "name of warning",
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
    title: ci18n("name of warning", "Misleading Claims"),
    body: i`Products and/or listings must comply with all applicable laws and regulations to the product being advertised. Wish prohibits listings with misleading claims and/or statements without adequate substantiation (including exaggerated claims). The title, description, price, size/color options, and images used to advertise a product should clearly and accurately reflect the product being sold. If such content is removed, the listing may be reactivated.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GLYPHOSATE: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Products containing glyphosate"),
    body: i`At this time, Wish prohibits the sale of Glyphosate and/or any product containing Glyphosate. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GIFT_CARDS_OR_ACCESS_CODES: {
    parent: "VIRTUAL_GOODS",
    title: ci18n("name of warning", "Gift Cards or Access Codes"),
    body: i`All goods sold on Wish must be tangible products. Wish prohibits the sale of gift cards or access codes. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANT_SEEDS: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of warning", "Plant Seeds"),
    body: i`Wish has detected prohibited content on this listing and has been flagged for violating Wish's Policies on "Plants and Plant Seeds".${"\n\n"}The sale of plant seeds is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish. [Learn more](${"https://merchant.wish.com/policy/inappropriate-reasons/44"}).`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  UNVERIFIED_FREE_SHIPPING: {
    parent: "FALSE_ADVERTISING",
    title: ci18n("name of warning", "Unverified Free Shipping Claim"),
    body: i`Providing shipping time frame information in the images, title, or description of a product is prohibited on WIsh. If such content is removed, the listing may be reactivated.`,
    policy: i`[False Advertising Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/25"})`,
    faq: i`[False Advertising FAQ](${zendeskURL(
      "mu360005950894",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  STANDALONE_LITHIUM_BATTERY: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n(
      "name of warning",
      "Lithium standalone and lithium-ion battery",
    ),
    body: i`At this time, Wish prohibits the sale of Standalone Lithium or Lithium-Ion batteries. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  LASER_POINTERS: {
    parent: "WEAPON",
    title: ci18n("name of warning", "High-Powered Laser Pointers"),
    body: i`At this time, Wish prohibits the sale of high-powered laser pointers. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VALUE_VARIANCE: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of warning", "Value Variance"),
    body: i`This listing contains multiple products with a difference in value of product quality and/or price discrepancies. Please make all available options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEXUALLY_EXPLICIT_MATERIAL: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Sexually Explicit Material"),
    body: i`Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  BULLION: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of warning", "Bullion"),
    body: i`Counterfeit and/or replica bullion is prohibited on Wish. This product may not be relisted.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  JAMMERS: {
    parent: "ILLEGAL_ELECTRONICS",
    title: ci18n("name of warning", "Jammers"),
    body: i`At this time, Wish prohibits the sale of signal jammers. This product may not be relisted.`,
    policy: i`[Privacy and Technology Violations Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/27"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FIREARMS_AND_GUNS: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Firearms / Guns"),
    body: i`At this time, Wish prohibits the sale of Firearms / Guns. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CHILD_CARSEAT: {
    parent: "SAFETY_EQUIPMENT",
    title: ci18n("name of warning", "Child Car Seat"),
    body: i`The sale of child car seats is prohibited unless you are a pre-approved merchant within specific regions. If you are a pre-approved merchant, please provide authorization documentation to relist this product on Wish.`,
    policy: i`[Safety Equipment Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/38"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SEXUAL_CONTENT_INCLUDING_MINOR: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Sexual Content Including Minor"),
    body: i`Products and listings which promote, allude, and/or depict sexual engagement with a minor are not permitted on Wish. This product may not be relisted.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_BUILDING_KITS: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Gun Building Kits"),
    body: i`At this time, Wish prohibits the sale of real gun building kits including instructions, pieces, blueprints, and other materials. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PLANT_SEED_WITH_IMPOSSIBLE_CLAIM_V2: {
    parent: "PLANTS_AND_SEEDS",
    title: ci18n("name of warning", "Plant Seeds with Impossible Claims"),
    body: i`The images and/or description for these plant seeds make impossible claims. Misuse of images and other listing elements to falsely promote a product is not permitted.This listing may be reactivated if such images or references are removed.`,
    policy: i`[Plants and Plant Seeds Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/44"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  IMAGE_NOT_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "All But One of the Images are not of the Product",
    ),
    body: i`All images should accurately include the product that is being sold. Additionally, the main image must always show the product being sold. Please update all images and create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  EYELASH_GROWTH_SERUM: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Eyelash Growth Serum"),
    body: i`At this time, Wish prohibits the sale of eyelash growth serum. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  FEEDBACK_ABOUT_NO_PRODUCT: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "Customer Feedback About No Product Received",
    ),
    body: i`The product reviews or image evidence from our customers indicate that many did not receive the product, indicating false tracking, receiving a letter/gift, or receiving an empty package. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  CIGARETTE: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Cigars and Cigarettes"),
    body: i`At this time, Wish prohibits the sale of all types of cigars and cigarettes. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NOT_DESCRIBE_AVAILABLE_QUANTITY: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n(
      "name of warning",
      "First Image / Title does not explicitly describe each available quantities",
    ),
    body: i`The first image and/or title only shows the largest available quantity. Please clearly advertise the various quantity of products being sold in this listing in order to make all available options clear and easy to identify for customers. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATEFUL_CORONAVIRUS_PRODUCTS: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Hateful Coronavirus Products"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  INJECTABLE_ITEMS: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Injectable Items"),
    body: i`At this time, Wish prohibits the sale of injectable items. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CONTAINS_HARMFUL_CONTENT: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of warning", "Contains Harmful Content"),
    body: i`Products that contain (or listings referencing) toxic or harmful, hazardous, dangerous, or prohibited metals, substances, and/or chemicals are prohibited on Wish. This product may not be relisted.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SIZE_COLOR_OPTION_GAMING: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of warning", "Size / Color Option Gaming"),
    body: i`The drop-down options for size or color includes unrealistic options. Based on the size and color options provided, it is unclear what product is being sold. Please make all available drop-down options clear and easy to identify for customers and create a new listing that accurately represents the product being sold.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HATE_GROUPS: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "Hate Groups"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  QANON_MEMORABILIA: {
    parent: "HATE_CRIME",
    title: ci18n("name of warning", "QAnon Memorabilia"),
    body: i`At this time, Wish does not permit the sale of any product which glorifies or endorses hatred, violence, racial, sexual or religious intolerance. Items which promote organizations holding such beliefs are also prohibited. This product may not be relisted.`,
    policy: i`[Hateful Symbols & Messages Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/23"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  SURPRISE_BOX: {
    parent: "AMBIGUOUS_LISTING",
    title: ci18n("name of warning", "Surprise Boxes"),
    body: i`At this time, Wish does not permit the sale of surprise boxes, mystery gifts, or shipping random products without a choice. This product may not be relisted.`,
    policy: i`[Ambiguous Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/28"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CUSTOMER_FEEDBACK_ABOUT_FALSE_SPEC: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Customer Feedback About False Spec"),
    body: i`Listings and/or product variations advertising devices with false, exaggerated, unreasonable, or impossible capacities/specifications (e.g., the sale of storage devices with false or impossible capacities) are prohibited on Wish. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  BUTANE: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Butane"),
    body: i`At this time, Wish prohibits the sale of Butane. This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  PURCHANSED_FOLLOWERS: {
    parent: "VIRTUAL_GOODS",
    title: ci18n("name of warning", "Purchased Social Media Followers"),
    body: i`All goods sold on Wish must be tangible products. The sale of social media boosts or follower packages is not permitted. This product may not be relisted.`,
    policy: i`[Virtual Goods Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/21"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MISSING_KEY_REQUIREMENTS: {
    parent: "JEWELRY_AND_METALS",
    title: ci18n("name of warning", "Missing Key Requirements"),
    body: i`Products and/or listings must comply with all applicable laws and regulations to the product being advertised. The title, description, price, size/color options, and images used to advertise a product should clearly and accurately reflect the product being sold. Products or listings that do not meet authentication requirements, and/or products or listings with false or fake documentation are not permitted on Wish. If such content is removed, the listing may be reactivated.`,
    policy: i`[Jewelry Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/49"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  GUN_SILENCERS: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Gun Silencers"),
    body: i`At this time, Wish prohibits of all silencers, suppressors, or other sound moderators (whether intended for firearms or other items).`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  CONTACTS: {
    parent: "MEDICAL_MATERIALS",
    title: ci18n("name of warning", "Contacts"),
    body: i`At this time, Wish prohibits the sale of contact lenses. This product may not be relisted.`,
    policy: i`[Medically Regulated Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/34"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  TITLE_IMAGE_MISMATCH: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Title and Main Image Discrepancy"),
    body: i`The title and/or main image of this listing does not accurately represent the product being sold. There is conflicting information between the title and main Image. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please correct both the title and main image and create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  COCKROACH_CHALK: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Cockroach Chalk"),
    body: i`At this time, Wish prohibits the sale of products intended to kill or repel cockroaches (including cockroach chalk, powder and gel). This product may not be relisted.`,
    policy: i`[Hazardous Materials Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/35"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  HOOKAH_PEN: {
    parent: "SMOKING",
    title: ci18n("name of warning", "Hookah Pens"),
    body: i`At this time, Wish prohibits the sale of hook pens and/or its variants. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VAPE_LIQUID: {
    parent: "SMOKING",
    title: ci18n("name of warning", "E-Juice / E-Liquid / Vape Liquid"),
    body: i`At this time, Wish prohibits the sale of e-juice, e-liquid, vape liquid, and/or its variants. This product may not be relisted.`,
    policy: i`[Drugs and Drug Paraphernalia Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/14"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DANGEROUS_CPA_VIOLATION: {
    parent: "DANGEROUS_ITEMS",
    title: ci18n("name of warning", "CPA Takedown"),
    body: i`Wish does not permit the sale of products which may potentially or actually be dangerous or unsafe to consumers, their property, and/or that may violate safety standards, laws, or regulations. This product may not be relisted.`,
    policy: i`[Dangerous and Unsafe Items Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/46"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  AMMUNITION: {
    parent: "WEAPON",
    title: ci18n("name of warning", "Ammunition"),
    body: i`At this time, Wish prohibits the sale of Ammunition. This product may not be relisted.`,
    policy: i`[Weapons Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/7"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  MISLEADING_KEY_FEATURE: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Missing Key Feature"),
    body: i`Wish received written feedback indicating the product received was missing a key feature that the item was originally advertised with. Listings which misrepresent products or set false expectations for customers are considered misleading and is in direct violation of Wish's policies. Please create a new listing that accurately represents the product being sold.`,
    policy: i`[Misleading Listing Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/33"})`,
    faq: i`[Misleading Listing FAQ](${zendeskURL("mu360003237193")})`,
  },
  UNCENSORED_EROTIC_ANIME: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Uncensored Erotic Anime"),
    body: i`Pornographic material such as uncensored depictions of erotic anime products are not permitted. Compliant listings sexualized anime products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed or appropriately censored.`,
    policy: i`[Graphic Sexual Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/22"})`,
    faq: i`[Graphic Sexual Content Guidelines](${zendeskURL(
      "mu360037656554",
    )}), [Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  VHS_TAPE: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "VHS Tapes"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list VHS tapes. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  VIDEO_GAME: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "Video Games"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list Video Games. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  EPA_EMMISIONS_DEFEAT_US: {
    parent: "REGIONAL_RESTRICTIONS",
    title: ci18n(
      "name of warning",
      "EPA emission defeat devices available in the United States",
    ),
  },
  PROHIBITED_CUSTOMS_CN: {
    parent: "REGIONAL_RESTRICTIONS",
  },
  IMAGE_OR_TITLE_CHANGE: {
    parent: "PRODUCT_MODIFIED",
  },
  BLURRED_LOGOS: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Blurred or Censored Logos"),
    body: i`At this time, Wish does not permit the practice of blurring or censoring logos to sell unauthorized products.${"\n\n"}To reactivate this this listing, ensure all images used are transparent and provide a Brand Authorization for any branded goods being sold.`,
  },
  ANIME_PRODUCTS: {
    parent: "NUDITY",
    title: ci18n(
      "name of warning",
      "Anime Products without sufficient censorship",
    ),
  },
  NOT_FOCUS_MAIN_IMAGE: {
    parent: "MISLEADING_LISTING",
    title: ci18n(
      "name of warning",
      "Product is not the focus of the main image",
    ),
    body: i`The product being sold is not the focus of the first image. The listing may be reactivated if the first image is changed to display the image being sold.`,
  },
  GRADUAL_CHANGE: {
    parent: "PRODUCT_MODIFIED",
  },
  CN_PROHIBITED_PRODUCT_STUN_GUNS: {
    parent: "CN_PROHIBITED_PRODUCTS",
    title: ci18n("name of warning", "Stun Guns"),
    body: i`Product listing is prohibited in your region.`,
  },
  FULLY_EXPOSED_NIPPLE: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Fully Exposed Real Female Nipples"),
    body: i`Pornographic material such as images of real female nipples are not permitted. Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed or appropriately censored.`,
  },
  RECORDS: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "Records"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list records. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  HIDDEN_SEX_TOYS: {
    parent: "PRODUCT_MODIFIED",
  },
  BRANDING_CHANGE: {
    parent: "PRODUCT_MODIFIED",
  },
  EROTIC_SETUPS: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Erotic Setups"),
  },
  EPA_PESTICIDES_US: {
    parent: "REGIONAL_RESTRICTIONS",
    title: ci18n(
      "name of warning",
      "EPA pesticide products available in the United States",
    ),
  },
  BLUE_RAY: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "Blu-rays"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list Blu-Rays. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  IMAGE_OF_MASTURBATION: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Image of Masturbation"),
    body: i`Pornographic material such as depictions and images of masturbation are not permitted. Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed or appropriately censored.`,
  },
  DVD: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "DVDs"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list DVD's. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  BLURRED_WATERMARKS: {
    parent: "BLURRED_INFORMATION",
    title: ci18n("name of warning", "Blurred Watermarks"),
    body: i`At this time, Wish does not permit the practice of using images with blurred watermarks. Wish encourages merchants to use their own images in listings or only utilize images which they have been given authorization to use. ${"\n\n"}To reactivate this this listing, ensure all images used are transparent and provide a Brand Authorization for any copyrighted images that are used.`,
  },
  PESTICIDES: {
    parent: "HAZARDOUS_MATERIALS",
    title: ci18n("name of warning", "Pesticides"),
    body: i`Wish only allows the sales of pesticides if they comply with laws and regulations.`,
  },
  BLURRED_TAGS: {
    parent: "BLURRED_INFORMATION",
    title: ci18n("name of warning", "Blurred or Censored Tags"),
    body: i`At this time, Wish does not permit the practice of blurring or censoring tags and labels to sell unauthorized products.${"\n\n"}To reactivate this this listing, ensure all images used are transparent and provide a Brand Authorzation for any branded goods being sold.`,
  },
  CD: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "CDs"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list CD's. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  FULLY_EXPOSED_ANUS: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Fully Exposed Real Anus"),
    body: i`Pornographic material such as images of real anuses are not permitted. Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed or appropriately censored.`,
  },
  IMAGE_OF_PENETRATION: {
    parent: "NUDITY",
    title: ci18n("name of warning", "Image of Penetration"),
    body: i`Pornographic material such as images of sexual penetration are not permitted. Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed or appropriately censored.`,
  },
  CASSETTE_TAPE: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "Cassette Tapes"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list cassette tapes.${"\n\n"}In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  CN_PROHIBITED_PRODUCT_TASERS: {
    parent: "CN_PROHIBITED_PRODUCTS",
    title: ci18n("name of warning", "Tasers"),
    body: i`Product listing is prohibited in your region.`,
  },
  FULLY_EXPOSED_GENITAL: {
    parent: "NUDITY",
    title: ci18n(
      "name of warning",
      "Fully Exposed, Real Male / Female Genitals",
    ),
    body: i`Pornographic material such as images of real male or female genitalia are not permitted. Compliant listings of health and sensuality products must use images that clearly display the product for sale without the use of gratuitous nudity or obscenity. The listing may be reactivated if such images are removed.`,
  },
  CN_PROHIBITED_PRODUCT_BB_GUNS: {
    parent: "CN_PROHIBITED_PRODUCTS",
    title: ci18n("name of warning", "BB Guns"),
    body: i`Product listing is prohibited in your region.`,
  },
  CN_PROHIBITED_PRODUCT_AIRSOFT: {
    parent: "CN_PROHIBITED_PRODUCTS",
    title: ci18n("name of warning", "Airsoft"),
    body: i`Product listing is prohibited in your region.`,
  },
  SOFTWARE: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "Software"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list software. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  LASER_DISC: {
    parent: "UNLICENSED_MEDIA",
    title: ci18n("name of warning", "Laser Discs"),
    body: i`Wish requires proof or ownership or authorization to sell in order to list laser discs. In order to relist this product for sale, please provide us with authorization from the Rights owner or other authorized party.`,
  },
  MISLEADING_WIG: {
    parent: "MISLEADING_LISTING",
    title: ci18n("name of warning", "Misleading Wig"),
    body: i`The reviews from our customers show that less than half receive the product as advertised`,
  },
  CN_PROHIBITED_PRODUCT_IMITATION_FIREARMS: {
    parent: "CN_PROHIBITED_PRODUCTS",
    title: ci18n("name of warning", "Imitation Firearms"),
    body: i`Product listing is prohibited in your region`,
  },
};

const CounterfeitReasonData: {
  readonly [reason in CounterfeitReason]: Partial<Copy>;
} = {
  SAFETY_EQUIPMENT: {
    title: i`Safety Equipment`,
    body: i`This listing has been flagged for violating Wish's Policies on "Safety Equipment". For more information regarding our "Safety Equipment" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/38"}).`,
  },
  GRAPHIC_VIOLENCE: {
    title: i`Graphic Violence`,
    body: i`This listing has been flagged for violating Wish's Policies on "Graphic Violence". For more information regarding our "Graphic Violence" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/48"}).${"\n\n"}At this time, Wish prohibits the sale of products that depict graphic violence. This listing may be reactivated if such images are removed.`,
    policy: i`[Graphic Violence Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/48"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  ILLEGAL_ELECTRONICS: {
    title: i`Privacy and Technology Violations`,
    body: i`This listing has been flagged for violating Wish's Policies on  "Privacy and Technology Violations". For more information regarding our "Privacy and Technology Violations" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/27"}).`,
  },
  ANIMAL_PRODUCTS: {
    title: i`Animal Products`,
    body: i`This listing has been flagged for violating Wish's Policies on "Animal Products". For more information regarding our "Animal Products" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/41"}).`,
  },
  FALSE_ADVERTISING: {
    title: i`False Advertising`,
    body: i`This listing has been flagged for violating Wish's Policies on "False Advertising". For more information regarding our "False Advertising" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/25"}).`,
  },
  RECALLED_TOYS: {
    title: i`Recalled Items`,
    body: i`This listing has been flagged for violating Wish's Policies on "Recalled Items". For more information regarding our "Recalled Items" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/18"}).`,
  },
  PLANTS_AND_SEEDS: {
    title: i`Plants and Plant Seeds`,
    body: i`This listing has been flagged for violating Wish's Policies on "Plants and Plant Seeds". For more information regarding our "Plants and Plant Seeds" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/44"}).`,
  },
  UNVERIFIED_MONEY: {
    title: i`Unverified and Counterfeit Currency`,
    body: i`This listing has been flagged for violating Wish's Policies on "Unverified and Counterfeit Currency". For more information regarding our "Unverified and Counterfeit Currency" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/39"}).`,
  },
  WEAPON: {
    title: i`Weapons`,
    body: i`This listing has been flagged for violating Wish's Policies on "Weapons". For more information regarding our "Weapons" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/7"}).`,
  },
  PRICE_GOUGING: {
    title: i`Price Gouging`,
    body: i`This listing has been flagged for violating Wish's Policies on "Price Gouging". For more information regarding our "Price Gouging" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/40"}).${"\n\n"}Product listings that are priced significantly higher than reasonable market value are not permitted on Wish. Please create a new listing that accurately represents the value of the product being sold.`,
    policy: i`[Price Gouging Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/40"})`,
    faq: i`[Coronavirus / COVID-19 Pandemic Price Gouging Policy FAQ](${zendeskURL(
      "mu1260802749270",
    )})`,
  },
  SMOKING: {
    title: i`Drugs and Drug Paraphernalia`,
    body: i`This listing has been flagged for violating Wish's Policies on "Drugs and Drug Paraphernalia". For more information regarding our "Drugs and Drug Paraphernalia" Policy, [click here]${"https://merchant.wish.com/policy/inappropriate-reasons/14"}.`,
  },
  MISLEADING_LISTING: {
    title: i`Misleading Listing`,
    body: i`This listing has been flagged for violating Wish's Policies on "Misleading Listings". For more information regarding our "Misleading Listings" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/33"}).`,
  },
  REGIONAL_RESTRICTIONS: {
    title: i`Regional Restrictions`,
    body: i`This product (and product listing) has been regionally restricted from sale (and offers for sale) in [geoblock country(s)]. Please do not list this product in the region(s) specified above because of one or more of the following product compliance reasons (without limitation): (a) missing regulatory labels and/or warnings; (b) failed, unverified, or lack of accredited lab testing or conformity assessment(s); (c) risk of physical injury or property damage; and/or (d) technical standards violation(s).${"\n\n"}If your product is not listed in the region(s) specified above you can ignore this infraction.${"\n\n"}For more information regarding regionally restricted products [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/42"}).`,
    policy: i`[Regional Restrictions Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/42"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  NUDITY: {
    title: ci18n("name of warning", "Graphic Sexual Content"),
    body: i`This listing has been flagged for violating Wish's Policies on "Graphic Sexual Content". For more information regarding our "Graphic Sexual Content" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/46"}).`,
  },
  HATE_CRIME: {
    title: i`Hateful Symbols & Messages`,
    body: i`This listing has been flagged for violating Wish's Policies on "Hateful Symbols and Messages". For more information regarding our "Hateful Symbols and Messages" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/23"}).`,
  },
  MEDICAL_MATERIALS: {
    title: i`Medically Regulated Materials`,
    body: i`This listing has been flagged for violating Wish's Policies on "Medically Regulated Materials". For more information regarding our "Medically Regulated Materials" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/34"}).`,
  },
  AMBIGUOUS_LISTING: {
    title: ci18n("title", "Ambiguous Listing"),
    body: i`This listing has been flagged for violating Wish's Policies on "Ambiguous Listings". For more information regarding our "Ambiguous Listings" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/28"}).`,
  },
  JEWELRY_AND_METALS: {
    title: i`Jewelry and Metals`,
    body: i`This listing has been flagged for violating Wish's Policies on "Jewelry". For more information regarding our "Jewelry" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/49"}).`,
  },
  CONSUMPTION_MATERIALS: {
    title: i`Materials for Consumption`,
    body: i`This listing has been flagged for violating Wish's Policies on "Materials for Consumption". For more information regarding our "Materials for Consumption" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/22"}).`,
  },
  HAZARDOUS_MATERIALS: {
    title: ci18n("title", "Hazardous Materials"),
    body: i`This listing has been flagged for violating Wish's Policies on "Hazardous Materials". For more information regarding our "Hazardous Materials" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/35"}).`,
  },
  DISTASTEFUL_CONTENT: {
    title: i`Distasteful Content`,
    body: i`This listing has been flagged for violating Wish's Policies on "Distasteful Content". For more information regarding our "Distasteful Content" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/47"}).${"\n\n"}At this time, Wish prohibits the sale of products that depict distasteful imagery. This listing may be reactivated if such images are removed.`,
    policy: i`[Distasteful Content Policy](${"https://merchant.wish.com/policy/inappropriate-reasons/47"})`,
    faq: i`[Prohibited Product Listings FAQ](${zendeskURL("205211777")})`,
  },
  DANGEROUS_ITEMS: {
    title: i`Dangerous and Unsafe Items`,
    body: i`This listing has been flagged for violating Wish's Policies on “Dangerous and Unsafe Items.” For more information regarding our “Dangerous and Unsafe Items” Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/46"}).`,
  },
  VIRTUAL_GOODS: {
    title: i`Virtual Goods`,
    body: i`This listing has been flagged for violating Wish's Policies on "Virtual Goods". For more information regarding our "Virtual Goods" Policy, [click here](${"https://merchant.wish.com/policy/inappropriate-reasons/21"}).`,
  },
  UNLICENSED_MEDIA: {
    title: ci18n("name of warning", "Unlicensed Media"),
  },
  LIGHTERS: {
    title: ci18n("name of warning", "Lighters"),
  },
  PROP_MONEY: {
    title: ci18n("name of warning", "Prop Money"),
  },
  BLURRED_WATERMARK: {
    title: ci18n("name of warning", "Blurred Watermarks"),
    body: i`At this time, Wish does not permit the practice of using images with blurred watermarks. Wish encourages merchants to use their own images in listings or only utilize images which they have been given authorization to use. ${"\n\n"}To reactivate this this listing, ensure all images used are transparent and provide a Brand Authorization for any copyrighted images that are used.`,
  },
  WISH_ADMIN: {},
  HARMFUL_CHEMICALS: {
    title: ci18n("name of warning", "Dangerous Chemicals"),
  },
  CN_PROHIBITED_PRODUCTS: {
    title: ci18n("name of warning", "CN Prohibited Products"),
    body: i`Product listing is prohibited in your region.`,
  },
  CARSEAT: {
    title: ci18n("name of warning", "Child Carseat"),
  },
  TEAM_LOGO: {
    title: ci18n("name of warning", "Sporting Trademark"),
    body: i`The product in your listing has been flagged for the unauthorized use of a sporting trademark. Wish requires proof of authorization to sell in order to list branded team merchandise.${"\n\n"}To reactivate this listing, provide us with authorization from the trademark owner or a trademark license from an authorized party allowing third-party use of the trademark.`,
  },
  PICTURED_WITH_MAJOR_BRAND: {
    title: ci18n(
      "name of warning",
      "Pictured with boxes/bag/hanger/store front of a major brand",
    ),
    body: i`The product listing contains an image with a brand logo. The brand may not appear on boxes, hangers, bags, store fronts, etc (this list is not exhaustive).`,
  },
  PIERCING_GUN: {
    title: ci18n("name of warning", "Piercing Gun"),
  },
  ADULT_CONTENT: {
    title: ci18n("name of warning", "Adult Content"),
  },
  PRODUCT_MODIFIED: {
    title: ci18n("name of warning", "Product Modified"),
    body: i`The product was changed completely.`,
  },
  CENSORED_FACE: {
    title: ci18n("name of warning", "Censored Face"),
    body: i`The product listing contains an image with a face that has been blurred out.`,
  },
  BLURRED_LABEL: {
    title: ci18n("name of warning", "Blurred Label"),
    body: i`The product listing contains an image with a label, tag or logo that is blurred out.`,
  },
  HOVERBOARD: {
    title: ci18n("name of warning", "Hoverboard"),
    body: i`To relist this product for sale, please contact your account manager and provide proof that this product meets safety regulations.`,
  },
  CELEBRITY_PHOTO: {
    title: ci18n("name of warning", "Celebrity Photo"),
    body: i`The product listing contains an image with a photo of a celebrity.`,
  },
  TRICK_CANDLES: {
    title: ci18n("name of warning", "Trick Candles"),
  },
  BLURRED_INFORMATION: {
    title: ci18n("name of warning", "Blurred Information"),
    body: i`This listing has been flagged for violating Wish\'s policies on "Censored Information".`,
  },
  IS_MAJOR_BRAND: {
    title: ci18n("name of warning", "Counterfeit and/or IP Violation"),
    body: i`The product listing contains a direct copy or imitation of a brand's logo, design or pattern or uses copyrighted images belonging to others.`,
  },
  HARNESS: {
    title: ci18n("name of warning", "Child Harness"),
    body: i`Child harnesses may only be sold within restricted regions by merchants enrolled in Wish's Local-to-Local program. Provide authorization documentation to relist this product on Wish.`,
  },
  TATTOO_GUN: {
    title: ci18n("name of warning", "Tattoo Gun"),
  },
  MISLEADING_LISTING_AUTHENTIC_BRAND: {
    title: ci18n("name of warning", "Counterfeit and/or IP Violation"),
    body: i`This product listing has been detected to violate Wish's Merchant Policy on misleading listings by being identified by the Wish Merchant as being an authentic branded product, but instead appearing to be non-authentic. Please provide either a brand or other proof of authenticity to re-list your branded product.`,
  },
  CONTACT_LENSES: {
    title: ci18n("name of warning", "Contact Lenses"),
  },
  BIKE_HELMETS: {
    title: ci18n("name of warning", "Bike and Motorcycle Helmets"),
  },
  PLANT_SEEDS: {
    title: ci18n("name of warning", "Plant Seeds"),
    body: i`Plant seeds may only be sold within restricted regions by merchants enrolled in Wish's Local-to-Local program. Provide authorization documentation to relist this product on Wish.`,
  },
};

const MerchantWarningReasonData: {
  readonly [reason in MerchantWarningReason]: Copy;
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
    body: i`You have violated a [Wish Merchant Policy](${"https://merchant.wish.com/policy"})`,
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
    body: i`Wish has found that your account violated our [Terms of Service](${"https://merchant.wish.com/terms-of-service"}) with deceptive, fraudulent, or illegal activity`,
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
    title: i`Intellectual Property Violation - TRO`,
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
    body: i`Wish has detected that your account has been [inactive](${"https://merchantfaq.wish.com/hc/en-us/articles/9358114053787-Inactive-account-infractions"}) for some time`,
    policy: i`[Account Suspension Policy](${"https://merchant.wish.com/policy#account_suspension"})`,
    faq: i`[Inactive Account Infractions FAQ](${zendeskURL("9358114053787")})`,
  },
  ORDER_NOT_DELIVERED: {
    title: i`Order Not Delivered`,
    body: i`Based on confirmed tracking information, this order did not arrive before (max TTD + ${7} days).
      Note: Wish will automatically reverse this infraction if the order is confirmed delivered or gets paid out.`,
    policy: i`[Fulfillment Policy](${"https://merchant.wish.com/policy#fulfillment"})`,
    faq: undefined,
  },
  //
  // below data is rarely used and should normally be overwritten by the above
  // reason and subreason dicts
  //
  PRODUCT_IS_INAPPROPRIATE: {
    title: i`Prohibited Content`,
    body: i`This product listing contains [prohibited content](${zendeskURL(
      "205211777",
    )}) (e.g.: unacceptable images, titles, descriptions, etc.).`,
    policy: i`[Listing Products Policy](${"https://merchant.wish.com/policy#listing"})`,
    faq: undefined,
  },
  WISH_STANDARDS_BAN: {
    title: ci18n("title of warning", "Wish Standards Ban"),
    body: i`Due to your low Wish Standards rating, you have been banned from the platform.`,
    policy: i`[Wish Standards Policy](${"https://merchant.wish.com/policy#wish_standards"})`,
    faq: undefined,
  },
  //
  // below infractions are deprecated, may be returned when viewing old infractions
  //
  REUPLOADING_COUNTERFEITS: getDeprecatedInfractionData(
    ci18n("name of warning", "Counterfeit goods (repeated)"),
  ),
  PRODUCT_LOW_RATING_NO_REMOVE: getDeprecatedInfractionData(
    ci18n("name of warning", "Low rated product"),
  ),
  VIOLATION_OF_TERMS: getDeprecatedInfractionData(
    ci18n("name of warning", "Violation of Terms"),
  ),
  STORE_VALIDATION_INCOMPLETE: getDeprecatedInfractionData(
    ci18n("name of warning", "Incomplete store validation"),
  ),
  TAX_SETTING_NOT_UPDATED: getDeprecatedInfractionData(
    ci18n("name of warning", "Tax setting update required"),
  ),
  MERCHANT_HARASSMENT: getDeprecatedInfractionData(
    ci18n("name of warning", "Harassment of Wish employees or property"),
  ),
  COUNTERFEIT_GOODS: getDeprecatedInfractionData(
    ci18n("name of warning", "Counterfeit Goods"),
  ),
  CS_LOW_CSAT_SCORE: getDeprecatedInfractionData(
    ci18n("name of warning", "Poor Customer Support"),
  ),
  LATE_FULFILLMENT_RATE: getDeprecatedInfractionData(
    ci18n("name of warning", "Late Fulfillment Rate"),
  ),
  DECEPTIVE_FULFILLMENT: getDeprecatedInfractionData(
    ci18n("name of warning", "Store is violating Deceptive Fulfillment Policy"),
  ),
  REPEAT_PRODUCT_SWAPPING: getDeprecatedInfractionData(
    ci18n("name of warning", "Repeated Product Swapping"),
  ),
  WISHPOST_ID_NOT_COMPLETE_FACE_RECOGNITION: getDeprecatedInfractionData(
    ci18n("name of warning", "Face recognition incomplete for wishpost ID"),
  ),
  HIGH_GMV_FROM_MISLEADING_PRODUCTS: getDeprecatedInfractionData(
    ci18n("name of warning", "High GMV from misleading products"),
  ),
  PRODUCT_HIGH_CANCEL_ORDER_RATE: getDeprecatedInfractionData(
    ci18n("name of warning", "High order cancellation rate"),
  ),
  BAN_EARLY_STAGE_MERCHANT: getDeprecatedInfractionData(
    ci18n("name of warning", "Violated Merchant Policy"),
  ),
  HIGH_REFUND_RATIO: getDeprecatedInfractionData(
    ci18n("name of warning", "Your store has an extremely high refund ratio"),
  ),
  POLICY_TIER_DEMOTION: getDeprecatedInfractionData(
    ci18n("name of warning", "Policy violations or gaming"),
  ),
  MERCHANT_HIGH_QUALITY_REFUND_RATIO: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "Your store has an extremely high refund rate from quality-related reasons",
    ),
  ),
  US_TAX_INFO_UNVALIDATED: getDeprecatedInfractionData(
    ci18n("name of warning", "U.S. Tax Identity Information Unvalidated"),
  ),
  PENALTY_FOR_AUTO_REFUND: getDeprecatedInfractionData(
    ci18n("name of warning", "Auto Refund Penalty"),
  ),
  FINAL_JUDGEMENT_ORDER: getDeprecatedInfractionData(
    ci18n("name of warning", "Final judgement order"),
  ),
  CONFIRMED_DELIVERY_POLICY: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "Your store is not meeting Confirmed Delivery Policy requirements",
    ),
  ),
  UNCONFIRMED_TRACKING_NUMBERS: getDeprecatedInfractionData(
    ci18n("name of warning", "Provided unconfirmed tracking numbers"),
  ),
  FINE_WISH_EXPRESS_POLICY_VIOLATION: getDeprecatedInfractionData(
    ci18n("name of warning", "Wish Express late fulfillment"),
  ),
  PRODUCT_HIGH_REFUND_RATIO_NO_REMOVE: getDeprecatedInfractionData(
    ci18n("name of warning", "High Refund Ratio No Remove"),
  ),
  RESPOND_TO_ADMIN: getDeprecatedInfractionData(
    ci18n("name of warning", "Wish Admin message response needed"),
  ),
  WISH_EXPRESS_POLICY_PRODUCT: getDeprecatedInfractionData(
    ci18n("name of warning", "Wish Express Policy Product"),
  ),
  PRODUCT_HIGH_QUALITY_REFUND_RATIO: getDeprecatedInfractionData(
    ci18n("name of warning", "High product quality-related refund rate"),
  ),
  MERCHANT_HIGH_REFUND_EAT_COST: getDeprecatedInfractionData(
    ci18n("name of warning", "Store has a high refund ratio"),
  ),
  DEP_FINE_DISABLE_PROMOTED_PRODUCT: getDeprecatedInfractionData(
    ci18n("name of warning", "Disabled a SKU while it was being promoted"),
  ),
  CS_LATE_RESPONSE_RATE: getDeprecatedInfractionData(
    ci18n("name of warning", "Long customer ticket response times"),
  ),
  WISH_EXPRESS_POLICY_VIOLATION: getDeprecatedInfractionData(
    ci18n("name of warning", "Wish Express late confirmed delivery"),
  ),
  HIGH_AUTO_REFUND: getDeprecatedInfractionData(
    ci18n("name of warning", "You did not fulfill orders within 5 days"),
  ),
  MERCHANT_HIGH_CANCEL_ORDER_RATE: getDeprecatedInfractionData(
    ci18n("name of warning", "Store has high order cancellation rate"),
  ),
  HIGH_GMV_FROM_GAMING_FREEZE: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "High share of sales from misleading listings and/or tracking",
    ),
  ),
  WISH_EXPRESS_POLICY_MERCHANT: getDeprecatedInfractionData(
    ci18n("name of warning", "Wish Express Policy Merchant"),
  ),
  EMPTY_PACKAGES: getDeprecatedInfractionData(
    ci18n("name of warning", "Sent empty packages"),
  ),
  VIOLATION_OF_POLICY_TIER: getDeprecatedInfractionData(
    ci18n("name of warning", "Violation of policy tier rules"),
  ),
  PRODUCT_LOW_RATING: getDeprecatedInfractionData(
    ci18n("name of warning", "Low rated product"),
  ),
  FINE_UPDATE_TO_COUNTERFEIT: getDeprecatedInfractionData(
    ci18n("name of warning", "Counterfeit penalty update"),
  ),
  RELATED_ACCOUNT_IS_BANNED: getDeprecatedInfractionData(
    ci18n("name of warning", "Related Account Ban"),
  ),
  DEP_FINE_DISABLE_PROMOTED_PRODUCT_FOR_COUNTRY: getDeprecatedInfractionData(
    ci18n("name of warning", "Disable Product For Country Promo Penalty"),
  ),
  DUPLICATE_ACCOUNTS: getDeprecatedInfractionData(
    ci18n("name of warning", "Duplicate Accounts"),
  ),
  EXTREMELY_HIGH_PRICE_SPREAD: getDeprecatedInfractionData(
    ci18n("name of warning", "Extremely High Price Variance"),
  ),
  HIGH_GMV_FROM_GAMING_BAN: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "High GMV from misleading products and/or fulfilled with fake tracking",
    ),
  ),
  HIGH_CHARGEBACK_AND_FRAUD_REFUND_RATIO: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "Your store has unacceptably high chargeback and/or fraud refund ratios",
    ),
  ),
  HIGH_GMV_FROM_GAMING_AUDIT: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "High GMV from misleading products & fake tracking",
    ),
  ),
  INVALID_EU_RESPONSIBLE_PERSON: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "You have submitted an invalid EU Responsible Person",
    ),
  ),
  FAKE_RATING: getDeprecatedInfractionData(
    ci18n("name of warning", "Fake rating"),
  ),
  DEP_BAIT_VARIABLE_PRICING: getDeprecatedInfractionData(
    "", // marked as not used / broken in clroot code, no usage found, no title exists in code
  ),
  INVALID_TRACKING_NUMBERS: getDeprecatedInfractionData(
    ci18n("name of warning", "Provided invalid tracking numbers"),
  ),
  HIGH_CHARGEBACK_RATIO: getDeprecatedInfractionData(
    ci18n(
      "name of warning",
      "Your store has an unacceptably high chargeback ratio",
    ),
  ),
  VIOLATE_TS_POLICY: getDeprecatedInfractionData(
    ci18n("name of warning", "Trust & Safety - Merchant policy violation"),
  ),
  DUPLICATE_PRODUCTS: getDeprecatedInfractionData(
    ci18n("name of warning", "Duplicate products"),
  ),
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
    "Declined",
  ),
  NOT_DISPUTED: ci18n(
    "a label showing a merchant the status of a dispute",
    "Not Disputed",
  ),
  DISPUTE_SUCCESS: ci18n(
    "a label showing a merchant the status of a dispute",
    "Approved",
  ),
};

export const MerchantWarningImpactTypeDisplayText: {
  readonly [impact in MerchantWarningImpactType]: (
    startDate: string | undefined,
    endDate: string | undefined,
    countries: ReadonlyArray<string>,
  ) => string;
} = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  PRODUCT_PAYMENT_HOLD: (startDate, endDate, countries) =>
    endDate
      ? i`Wish has withheld payments for orders for the listing until ${endDate}`
      : i`Wish has withheld payments for orders for this listing`,
  ORDER_PAYMENT_HOLD: (startDate, endDate, countries) =>
    endDate
      ? i`Wish will withhold payment for this order until ${endDate}`
      : i`Wish has withheld payment for this order`,
  AUTO_REFUND: (startDate, endDate, countries) =>
    startDate
      ? i`Wish refunded this order on ${startDate}`
      : i`Wish will auto-refund this order`,
  MERCHANT_IMPRESSION_BLOCK: (startDate, endDate, countries) =>
    endDate
      ? i`Wish will block impressions for your account until ${endDate}`
      : i`Wish will block impressions for your account`,
  MERCHANT_PAYMENT_HOLD: (startDate, endDate, countries) =>
    endDate
      ? i`Wish will withhold your payments until ${endDate}`
      : i`Wish will withhold your payments`,
  PRODUCT_TAKEDOWN: (startDate, endDate, countries) =>
    startDate
      ? i`Wish removed this product listing on ${startDate}`
      : i`Wish removed this product listing`,
  EAT_COST_FOR_PRODUCT: (startDate, endDate, countries) =>
    i`You are responsible for 100% of the costs of refunds on all orders for the product going forward`,
  PRODUCT_IMPRESSION_BLOCK: (startDate, endDate, countries) =>
    endDate
      ? i`Wish will block impressions for this product until ${endDate}`
      : i`Wish will block impressions for this product`,
  VARIATION_TAKEDOWN: (startDate, endDate, countries) =>
    startDate
      ? i`Wish removed this variation on ${startDate}`
      : i`Wish removed this variation`,
  GEOBLOCK: (startDate, endDate, countries) =>
    countries.length > 0
      ? i`This product will no longer appear in countries/regions that restrict its sale. It is now geoblocked in ${countries.join(
          ", ",
        )}`
      : i`This product will no longer appear in countries/regions that restrict its sale`,
  MERCHANT_BAN: (startDate, endDate, countries) =>
    i`Wish has banned your account`,
  /* eslint-enable @typescript-eslint/no-unused-vars */
};

export const MerchantWarningStateDisplayText: {
  readonly [state in MerchantWarningState]: string;
} = {
  AWAITING_AUTH_TAGGING_HIGH_GMV: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  US_BD_REVIEW_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  CN_BD_REVIEW_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  REQUEST_PAYMENT: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  AWAITING_ADMIN: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  REQUIRES_ADMIN_REVIEW: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
  AWAITING_ADMIN_BOT: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
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
    "Action Required",
  ),
  AWAITING_AUTH_TAGGING_LOW_GMV: ci18n(
    "a label showing a merchant the state of an infraction",
    "Awaiting Admin",
  ),
};

export const InfractionEvidenceTypeDisplayText: {
  readonly [type in InfractionEvidenceType]: string;
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
  INFRACTION: ci18n("a type of evidence for an infraction", "Infraction"),
};

const getTitle = <T extends string | undefined>(
  firstLevel: T,
  secondLevel: T | undefined,
  thirdLevel: T | undefined,
): T => {
  if (!secondLevel) {
    return firstLevel;
  }

  if (!thirdLevel) {
    return secondLevel;
  }

  return `${secondLevel} - ${thirdLevel}` as T;
};

const getBody = <T extends string | undefined>(
  firstLevel: T,
  secondLevel: T | undefined,
  thirdLevel: T | undefined,
): T => {
  if (!secondLevel) {
    return firstLevel;
  }

  if (!thirdLevel) {
    return secondLevel;
  }

  return `${firstLevel}${"\n\n&nbsp;\n\n"}${secondLevel}${"\n\n&nbsp;\n\n"}${thirdLevel}` as T;
};

const getCopy = <T extends string | undefined>(
  firstLevel: T,
  secondLevel: T | undefined,
  thirdLevel: T | undefined,
): T => {
  return thirdLevel ?? secondLevel ?? firstLevel;
};

export const getInfractionCopy = (
  reason: MerchantWarningReason,
  inappropriateReason: CounterfeitReason | undefined,
  inappropriateSubreason: TaggingViolationSubReasonCode | undefined,
): Copy =>
  reason !== "PRODUCT_IS_INAPPROPRIATE"
    ? MerchantWarningReasonData[reason]
    : {
        title: getTitle(
          MerchantWarningReasonData[reason].title,
          inappropriateReason &&
            CounterfeitReasonData[inappropriateReason].title,
          inappropriateSubreason &&
            TaggingViolationSubReasonCodeData[inappropriateSubreason].title,
        ),
        body: getBody(
          MerchantWarningReasonData[reason].body,
          inappropriateReason &&
            CounterfeitReasonData[inappropriateReason].body,
          inappropriateSubreason &&
            TaggingViolationSubReasonCodeData[inappropriateSubreason].body,
        ),
        policy: getCopy(
          MerchantWarningReasonData[reason].policy,
          inappropriateReason &&
            CounterfeitReasonData[inappropriateReason].policy,
          inappropriateSubreason &&
            TaggingViolationSubReasonCodeData[inappropriateSubreason].policy,
        ),
        faq: getCopy(
          MerchantWarningReasonData[reason].faq,
          inappropriateReason && CounterfeitReasonData[inappropriateReason].faq,
          inappropriateSubreason &&
            TaggingViolationSubReasonCodeData[inappropriateSubreason].faq,
        ),
      };
